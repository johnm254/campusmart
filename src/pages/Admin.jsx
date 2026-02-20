import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import {
    Users, ShoppingBag, BarChart3, Settings, ShieldAlert,
    TrendingUp, Plus, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight,
    ArrowDownRight, Mail, Phone, Activity, Tag
} from 'lucide-react';

const AdminDashboard = () => {
    const { user, addNotification, logout } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [settings, setSettings] = useState({
        site_name: 'CampusMart',
        maintenance_mode: 'false',
        contact_email: '',
        announcement: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const hasSecretAccess = sessionStorage.getItem('admin_access_unlocked') === 'true';

    useEffect(() => {
        if (!user?.is_admin && !hasSecretAccess) return;
        loadDashboardData();
    }, [user, activeTab, hasSecretAccess]);

    const loadDashboardData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            if (activeTab === 'overview' || activeTab === 'stats') {
                const data = await api.getAdminStats();
                setStats(data);
                if (activeTab === 'stats') {
                    const transData = await api.getAdminTransactions();
                    setTransactions(Array.isArray(transData) ? transData : []);
                }
            } else if (activeTab === 'users') {
                const data = await api.getAdminUsers();
                setUsers(Array.isArray(data) ? data : []);
            } else if (activeTab === 'products') {
                const data = await api.getAdminProducts();
                setProducts(Array.isArray(data) ? data : []);
            } else if (activeTab === 'logs') {
                const data = await api.getAdminLogs();
                setLogs(Array.isArray(data) ? data : []);
            } else if (activeTab === 'settings') {
                const data = await api.getAdminSettings();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error('Admin Load Error:', error);
            setError(error.message);
            addNotification('Error', error.message || 'Failed to sync with server', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleProduct = async (productId) => {
        try {
            const res = await api.toggleProductApproval(productId);
            addNotification('Success', res.message, 'success');
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Action failed', 'error');
        }
    };

    const handleToggleBan = async (userId) => {
        if (!confirm('Are you sure you want to change this user\'s access status?')) return;
        try {
            const res = await api.toggleUserBan(userId);
            addNotification('Updated', res.message, 'success');
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Action failed', 'error');
        }
    };

    const handleRoleUpdate = async (userId, isAdmin) => {
        try {
            const res = await api.updateUserRole(userId, isAdmin);
            addNotification('Role Updated', res.message, 'success');
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Update failed', 'error');
        }
    };

    const handleToggleVerification = async (userId) => {
        try {
            const res = await api.toggleUserVerification(userId);
            addNotification('Verified Status', res.message, 'success');
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Action failed', 'error');
        }
    };



    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateAdminSettings(settings);
            addNotification('Success', 'Site settings updated', 'success');
        } catch (error) {
            addNotification('Error', 'Failed to save settings', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const renderOverview = () => stats && (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
                <StatCard title="Total Comrades" value={stats.overview.total_users} trend={`+${stats.overview.users_today} today`} icon={Users} color="#4299e1" />
                <StatCard title="Market Listings" value={stats.overview.total_products} trend={`+${stats.overview.products_today} today`} icon={ShoppingBag} color="#48bb78" />
                <StatCard title="Gross Revenue" value={`KSh ${stats.overview.total_revenue.toLocaleString()}`} trend="Real-time" icon={TrendingUp} color="#9f7aea" />
                <StatCard title="Pending Review" value={stats.overview.pending_approvals} trend="Action Ready" icon={AlertTriangle} color="#ed8936" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f7' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', color: '#1a202c' }}>Recent Revenue Flux</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8fafc' }}>
                                <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>User Entity</th>
                                <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Allocation</th>
                                <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent_transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1.5rem 0', fontWeight: 700 }}>{tx.full_name}</td>
                                    <td style={{ padding: '1.5rem 0' }}><span style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: '#ebf4ff', color: '#3182ce', fontSize: '0.75rem', fontWeight: 800 }}>{tx.type}</span></td>
                                    <td style={{ padding: '1.5rem 0', fontWeight: 900, color: '#38a169', fontSize: '1.1rem' }}>+ KSh {tx.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f7' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', color: '#1a202c' }}>Node Registrations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {stats.recent_users.map((u, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '18px', background: 'linear-gradient(45deg, #f7fafc, #edf2f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '1px solid #e2e8f0', color: '#1d3d6e' }}>{u.full_name.charAt(0)}</div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{u.full_name}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#a0aec0', fontWeight: 500 }}>{u.email}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e0' }}>{new Date(u.created_at).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    const renderUsers = () => (
        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ textAlign: 'left', background: '#fcfcfd' }}>
                    <tr>
                        <th style={{ padding: '1.25rem', color: '#a0aec0', fontSize: '0.75rem' }}>IDENTIFIER</th>
                        <th style={{ padding: '1.25rem', color: '#a0aec0', fontSize: '0.75rem' }}>PRIVILEGES</th>
                        <th style={{ padding: '1.25rem', color: '#a0aec0', fontSize: '0.75rem' }}>TRUST STATUS</th>
                        <th style={{ padding: '1.25rem', color: '#a0aec0', fontSize: '0.75rem' }}>ACCESS</th>
                        <th style={{ padding: '1.25rem', color: '#a0aec0', fontSize: '0.75rem', textAlign: 'right' }}>COMMANDS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1.75rem 1.25rem' }}>
                                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{u.full_name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{u.email}</div>
                            </td>
                            <td style={{ padding: '1.75rem 1.25rem' }}>
                                <select
                                    value={u.is_admin}
                                    onChange={(e) => handleRoleUpdate(u.id, e.target.value === 'true')}
                                    style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.75rem', fontWeight: 800, background: u.is_admin ? '#fffbeb' : 'white', color: u.is_admin ? '#d97706' : '#64748b' }}
                                >
                                    <option value="false">MEMBER</option>
                                    <option value="true">ADMIN</option>
                                </select>
                            </td>
                            <td style={{ padding: '1.75rem 1.25rem' }}>
                                <div
                                    onClick={() => handleToggleVerification(u.id)}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '12px',
                                        background: u.is_verified ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1))' : '#f8fafc',
                                        border: u.is_verified ? '1px solid #FFD700' : '1px solid #e2e8f0',
                                        color: u.is_verified ? '#b8860b' : '#64748b'
                                    }}
                                >
                                    {u.is_verified ? <CheckCircle size={14} /> : <Clock size={14} />}
                                    <span style={{ fontSize: '0.7rem', fontWeight: 900 }}>{u.is_verified ? 'PREMIUM' : 'STANDARD'}</span>
                                </div>
                            </td>
                            <td style={{ padding: '1.75rem 1.25rem' }}>
                                {u.is_banned ?
                                    <span style={{ background: '#fff1f1', color: '#ee1c24', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900 }}>BANNED</span> :
                                    <span style={{ background: '#f0fff4', color: '#38a169', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 900 }}>ACTIVE</span>
                                }
                            </td>
                            <td style={{ padding: '1.75rem 1.25rem', textAlign: 'right' }}>
                                <button
                                    onClick={() => handleToggleBan(u.id)}
                                    style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', border: 'none', background: u.is_banned ? '#f0fff4' : '#fff1f1', color: u.is_banned ? '#38a169' : '#ee1c24', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s' }}
                                >
                                    {u.is_banned ? 'UNBAN' : 'TERMINATE ACCESS'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderProducts = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
            {products.map(p => (
                <div key={p.id} style={{ background: 'white', borderRadius: '28px', padding: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', gap: '1.5rem', border: '1px solid #edf2f7' }}>
                    <img src={p.image_url} alt="" style={{ width: '110px', height: '110px', borderRadius: '20px', objectFit: 'cover', border: '1px solid #f1f5f9' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#1a202c', marginBottom: '0.25rem' }}>{p.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#a0aec0', fontWeight: 600 }}>By: {p.seller_name}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 900, color: '#38a169', fontSize: '1.25rem' }}>KSh {p.price}</div>
                            <button
                                onClick={() => handleToggleProduct(p.id)}
                                style={{ padding: '0.6rem 1.25rem', borderRadius: '14px', border: 'none', fontWeight: 900, fontSize: '0.75rem', cursor: 'pointer', background: p.is_approved ? '#fff5f5' : '#f0fff4', color: p.is_approved ? '#f56565' : '#38a169', transition: '0.2s' }}
                            >
                                {p.is_approved ? 'DEACTIVATE' : 'AUTHORIZE'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );



    const renderStats = () => stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
                <div style={{ background: 'linear-gradient(135deg, #1d3d6e, #3a68b0)', borderRadius: '32px', padding: '2.5rem', color: 'white', boxShadow: '0 20px 40px rgba(29,61,110,0.2)' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.8, marginBottom: '0.5rem' }}>TOTAL PLATFORM EQUITY</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>KSh {stats.overview.total_revenue.toLocaleString()}</div>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                        <TrendingUp size={16} inline style={{ marginRight: '0.5rem' }} /> +12.5% from previous cycle
                    </div>
                </div>
                <StatCard title="Active Subscriptions" value={stats.overview.total_users} trend="Premium Core" icon={ShieldAlert} color="#ed8936" />
                <StatCard title="Average Order Value" value={`KSh 480`} trend="Fixed Rate" icon={TrendingUp} color="#48bb78" />
            </div>

            <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a202c' }}>Full Revenue Ledger</h3>
                    <button className="btn-secondary" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800 }}>EXPORT CSV ANALYSIS</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f8fafc' }}>
                            <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Transaction ID</th>
                            <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>User Entity</th>
                            <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Classification</th>
                            <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase' }}>Timestamp</th>
                            <th style={{ padding: '1rem 0', color: '#a0aec0', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map(tx => (
                            <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '1.5rem 0', fontWeight: 600, color: '#a0aec0', fontSize: '0.85rem' }}>TXN-{tx.id.toString().padStart(6, '0')}</td>
                                <td style={{ padding: '1.5rem 0', fontWeight: 800 }}>
                                    <div>{tx.full_name}</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#a0aec0' }}>{tx.email}</div>
                                </td>
                                <td style={{ padding: '1.5rem 0' }}>
                                    <span style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: '#f0fff4', color: '#38a169', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', border: '1px solid #c6f6d5' }}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td style={{ padding: '1.5rem 0', fontSize: '0.9rem', color: '#718096', fontWeight: 600 }}>{new Date(tx.created_at).toLocaleString()}</td>
                                <td style={{ padding: '1.5rem 0', fontWeight: 900, color: '#1a202c', textAlign: 'right', fontSize: '1.1rem' }}>KSh {tx.amount}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>No verified revenue transactions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #eef2f7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a202c' }}>Live Activity Core</h3>
                <button onClick={loadDashboardData} className="btn-jiji-green" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem' }}>FORCE RE-SYNC</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #edf2f7' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#1d3d6e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1a202c', marginBottom: '0.25rem' }}>
                                {log.full_name || 'System Entity'}
                                <span style={{ fontWeight: 500, color: '#718096', fontSize: '0.9rem', marginLeft: '0.5rem' }}>executed</span>
                                <span style={{ fontWeight: 800, color: '#4299e1', marginLeft: '0.5rem', textTransform: 'uppercase', fontSize: '0.85rem' }}>{log.action.replace(/_/g, ' ')}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#a0aec0', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600 }}>
                                <span>SEQ ID: {log.id}</span>
                                <span>•</span>
                                <span>{new Date(log.created_at).toLocaleString()}</span>
                            </div>
                        </div>
                        {log.metadata && (
                            <div style={{ fontSize: '0.75rem', color: '#4a5568', background: 'white', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {JSON.stringify(log.metadata)}
                            </div>
                        )}
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '5rem', color: '#a0aec0' }}>No activity records found in the central core.</div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <form onSubmit={handleSaveSettings} style={{ background: 'white', borderRadius: '32px', padding: '3.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #edf2f7', maxWidth: '900px' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Global Site Configuration</h3>
                <p style={{ color: '#a0aec0' }}>Configure core platform parameters and public visibility.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <div className="form-group">
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.75rem' }}>Platform Name</label>
                    <input
                        value={settings.site_name}
                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        style={{ background: '#f8fafc', border: '2px solid #edf2f7', padding: '1rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 600 }}
                    />
                </div>
                <div className="form-group">
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.75rem' }}>Support Core Email</label>
                    <input
                        value={settings.contact_email}
                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                        style={{ background: '#f8fafc', border: '2px solid #edf2f7', padding: '1rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 600 }}
                    />
                </div>
            </div>

            <div className="form-group" style={{ marginTop: '2.5rem' }}>
                <label style={{ fontWeight: 800, fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.75rem' }}>Global Announcement Banner</label>
                <textarea
                    value={settings.announcement}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    rows="3"
                    style={{ background: '#f8fafc', border: '2px solid #edf2f7', padding: '1rem', borderRadius: '16px', fontSize: '1rem', fontWeight: 600, width: '100%', resize: 'none' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', padding: '1.75rem', background: settings.maintenance_mode === 'true' ? '#fff5f5' : '#f0fff4', borderRadius: '24px', border: '1px solid #edf2f7' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 900, color: settings.maintenance_mode === 'true' ? '#f56565' : '#38a169', marginBottom: '0.25rem' }}>Maintenance Mode</div>
                    <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 500 }}>When active, only administrators can access the marketplace frontend.</div>
                </div>
                <select
                    value={settings.maintenance_mode}
                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.value })}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', border: '2px solid #edf2f7', fontWeight: 800, cursor: 'pointer' }}
                >
                    <option value="false">INACTIVE (LIVE)</option>
                    <option value="true">ACTIVE (OFFLINE)</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary"
                style={{ marginTop: '3.5rem', width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 900, boxShadow: '0 10px 25px rgba(29,61,110,0.2)' }}
            >
                {isSaving ? 'SYNCHRONIZING CORE...' : 'COMMIT CHANGES TO CORE'}
            </button>
        </form>
    );

    if (!user?.is_admin && !hasSecretAccess) {
        return (
            <div className="container fadeIn" style={{ textAlign: 'center', padding: '100px 20px' }}>
                <ShieldAlert size={64} color="#ee1c24" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Restricted Access</h1>
                <p style={{ color: '#666', maxWidth: '500px', margin: '1.5rem auto', fontSize: '1.1rem' }}>
                    This console is for authorized personnel only. Please sign in with an administrator account to continue.
                </p>
                <button onClick={() => window.location.href = '/'} className="btn btn-primary">Return to Marketplace</button>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', background: '#f0f2f5' }} className="fadeIn">
            {/* Sidebar */}
            <aside style={{
                width: '300px',
                background: 'white',
                borderRight: '1px solid #e0e0e0',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                position: 'sticky',
                top: '80px',
                height: 'calc(100vh - 80px)',
                boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
            }}>
                <div style={{ padding: '0 1rem 2rem', borderBottom: '1px solid #f0f0f0', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #1d3d6e, #3a68b0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(29,61,110,0.2)' }}>
                            <ShieldAlert size={28} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1d3d6e' }}>CampusMart</div>
                            <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Admin Console</div>
                        </div>
                    </div>
                </div>

                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'users', label: 'User Management', icon: Users },
                    { id: 'products', label: 'Product Control', icon: ShoppingBag },
                    { id: 'stats', label: 'Revenue & Sales', icon: TrendingUp },
                    { id: 'logs', label: 'Activity Logs', icon: Clock },
                    { id: 'settings', label: 'Site Settings', icon: Settings },
                ].map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.25rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: activeTab === item.id ? '#1d3d6e' : 'transparent',
                            color: activeTab === item.id ? 'white' : '#64748b',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            textAlign: 'left'
                        }}
                    >
                        <item.icon size={22} />
                        {item.label}
                    </button>
                ))}

                <button
                    onClick={logout}
                    style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ee1c24', padding: '1rem', background: '#fff1f1', border: '1px solid #ffebeb', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                >
                    <ArrowUpRight size={18} /> Logout Session
                </button>
            </aside>

            {/* Main Area */}
            <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
                <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a202c', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p style={{ color: '#718096', fontSize: '1.1rem', fontWeight: 500 }}>Global system controls and monitoring.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.75rem 1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user?.full_name || 'System'}</div>
                            <div style={{ fontSize: '0.7rem', color: '#48bb78', fontWeight: 800 }}>LIVE CORE ACCESS</div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#edf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#1d3d6e" /></div>
                    </div>
                </header>

                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '10rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto 3rem' }}></div>
                        <h2 style={{ color: '#1d3d6e', fontWeight: 800 }}>Syncing Central Core...</h2>
                    </div>
                ) : (
                    <div className="fadeIn">
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'products' && renderProducts()}
                        {activeTab === 'stats' && renderStats()}
                        {activeTab === 'logs' && renderLogs()}
                        {activeTab === 'settings' && renderSettings()}
                    </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.02)', border: '1px solid #eef2f7', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: `${color}10`, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={30} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 900, color: trend.startsWith('+') ? '#38a169' : '#f56565', background: trend.startsWith('+') ? '#f0fff4' : '#fff5f5', padding: '0.4rem 0.75rem', borderRadius: '10px' }}>{trend}</div>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#a0aec0', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 950, color: '#1a202c', letterSpacing: '-0.03em' }}>{value}</div>
    </div>
);

export default AdminDashboard;
