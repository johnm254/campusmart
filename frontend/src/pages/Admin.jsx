<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import {
    Users, ShoppingBag, BarChart3, Settings, ShieldAlert,
    TrendingUp, Plus, Search, Filter, MoreVertical,
    CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight,
    ArrowDownRight, Mail, Phone, Activity, Tag
} from 'lucide-react';

=======
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import {
    Users, ShoppingBag, Settings, ShieldAlert, MessageSquare,
    Search, CheckCircle, AlertTriangle, Activity,
    LayoutDashboard, Megaphone, Trash2, RefreshCw, LogOut,
    TrendingUp, Package, X, EyeOff, Zap
} from 'lucide-react';

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'community', label: 'Community Posts', icon: MessageSquare },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
    { id: 'settings', label: 'Site Settings', icon: Settings },
];

// ─── Shared SearchBar with Toggle UI ──────────────────────────────────────────
const AdminHeader = ({ activeTab, search, setSearch, onLogout, onRefresh, isLoading, isMobile, toggleMobileMenu }) => {
    const activeItem = NAV_ITEMS.find(n => n.id === activeTab) || NAV_ITEMS[0];
    const HeaderIcon = activeItem.icon;

    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: isMobile ? '1rem' : '2.5rem', background: 'white',
            padding: isMobile ? '1rem' : '1.25rem 2rem', borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)', position: 'sticky', top: 0, zIndex: 100,
            flexWrap: 'wrap', gap: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isMobile && <button onClick={toggleMobileMenu} style={{ background: 'transparent', border: 'none', color: '#1d3d6e', display: 'flex', alignItems: 'center' }}><Zap size={24} /></button>}
                {!isMobile && (
                    <div style={{ width: 45, height: 45, borderRadius: 12, background: 'linear-gradient(135deg, #1d3d6e, #2d5fa0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {HeaderIcon && <HeaderIcon size={24} />}
                    </div>
                )}
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 900, color: '#111827', margin: 0 }}>{activeItem.label}</h1>
                    {!isMobile && <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>System Administration Console</div>}
                </div>
            </div>

            <div style={{ flex: isMobile ? '1 1 100%' : 1, maxWidth: isMobile ? '100%' : '500px', order: isMobile ? 3 : 0, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={`Search in ${activeItem.label}...`}
                    style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3.5rem', borderRadius: 16, border: '1.5px solid #e2e8f0', background: '#fcfdfe', outline: 'none', fontSize: '0.95rem', fontWeight: 600, transition: '0.2s', boxSizing: 'border-box' }}
                />
                {search && (
                    <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={14} />
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button onClick={onRefresh} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 12, border: '1.5px solid #e2e8f0', background: 'white', color: '#1d3d6e', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <RefreshCw size={18} className={isLoading ? 'spin' : ''} />
                </button>
                <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: 12, border: '1.5px solid #fee2e2', background: '#fff1f2', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', transition: '0.2s' }}>
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
>>>>>>> teammate/main
const AdminDashboard = () => {
    const { user, addNotification, logout } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
<<<<<<< HEAD
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
=======
    const [posts, setPosts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ site_name: 'CampusMart', maintenance_mode: 'false', contact_email: '', announcement: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [announcementText, setAnnouncementText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    const hasSecretAccess = sessionStorage.getItem('admin_access_unlocked') === 'true';

    // ── Load data per tab ──────────────────────────────────────────────────
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'overview') {
                const data = await api.getAdminStats();
                setStats(data);
>>>>>>> teammate/main
            } else if (activeTab === 'users') {
                const data = await api.getAdminUsers();
                setUsers(Array.isArray(data) ? data : []);
            } else if (activeTab === 'products') {
                const data = await api.getAdminProducts();
                setProducts(Array.isArray(data) ? data : []);
<<<<<<< HEAD
=======
            } else if (activeTab === 'community' || activeTab === 'announcements') {
                const data = await api.getAdminCommunityPosts();
                setPosts(Array.isArray(data) ? data : []);
>>>>>>> teammate/main
            } else if (activeTab === 'logs') {
                const data = await api.getAdminLogs();
                setLogs(Array.isArray(data) ? data : []);
            } else if (activeTab === 'settings') {
                const data = await api.getAdminSettings();
                setSettings(prev => ({ ...prev, ...data }));
            }
<<<<<<< HEAD
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
=======
            // If we get here without throwing, access is confirmed
            setIsAccessDenied(false);
        } catch (err) {
            if (err.status === 401 || err.status === 403) {
                // Only show access denied if there's no secret access either
                if (!hasSecretAccess) {
                    setIsAccessDenied(true);
                } else {
                    addNotification('Access Error', err.message || 'Admin access denied', 'error');
                }
            } else {
                addNotification('Error', err.message || 'Failed to load data', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    }, [activeTab, hasSecretAccess]);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsMobileMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);

        // Reset search and close mobile menu when switching tabs
        setSearch('');
        setIsMobileMenuOpen(false);

        // Load data on tab change or initial mount
        loadData();

        return () => window.removeEventListener('resize', handleResize);
    }, [activeTab, loadData]);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleToggleBan = async (userId, isBanned) => {
        if (!confirm(`${isBanned ? 'Unban' : 'Ban'} this user?`)) return;
        try {
            const res = await api.toggleUserBan(userId);
            addNotification('Updated', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Action failed', 'error'); }
>>>>>>> teammate/main
    };

    const handleRoleUpdate = async (userId, isAdmin) => {
        try {
            const res = await api.updateUserRole(userId, isAdmin);
            addNotification('Role Updated', res.message, 'success');
<<<<<<< HEAD
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Update failed', 'error');
        }
=======
            loadData();
        } catch { addNotification('Error', 'Update failed', 'error'); }
>>>>>>> teammate/main
    };

    const handleToggleVerification = async (userId) => {
        try {
            const res = await api.toggleUserVerification(userId);
<<<<<<< HEAD
            addNotification('Verified Status', res.message, 'success');
            loadDashboardData();
        } catch (error) {
            addNotification('Error', 'Action failed', 'error');
        }
    };


=======
            addNotification('Verified', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Action failed', 'error'); }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('PERMANENTLY DELETE user and ALL their data? This includes products, posts, and messages. ACTION CANNOT BE UNDONE!')) return;
        try {
            const res = await api.deleteAdminUser(userId);
            addNotification('DELETED', res.message, 'success');
            loadData();
        } catch (err) { addNotification('CRITICAL ERROR', err.message || 'Deletion failed', 'error'); }
    };

    const handleToggleProduct = async (productId) => {
        try {
            const res = await api.toggleProductApproval(productId);
            addNotification('Updated', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Action failed', 'error'); }
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Permanently delete this product? This cannot be undone.')) return;
        try {
            const res = await api.deleteAdminProduct(productId);
            addNotification('Deleted', res.message || 'Product removed', 'success');
            loadData();
        } catch { addNotification('Error', 'Delete failed', 'error'); }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Permanently delete this post?')) return;
        try {
            await api.deleteAdminCommunityPost(postId);
            addNotification('Deleted', 'Post removed', 'success');
            loadData();
        } catch { addNotification('Error', 'Delete failed', 'error'); }
    };

    const handlePostAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementText.trim()) {
            addNotification('Empty', 'Please write your announcement first', 'warning');
            return;
        }
        setIsPosting(true);
        try {
            await api.postAnnouncement(announcementText.trim());
            addNotification('Published! 📣', 'Announcement is now live in the Community', 'success');
            setAnnouncementText('');
            setActiveTab('announcements');
            loadData();
        } catch (err) {
            addNotification('Failed', err.message || 'Could not post announcement', 'error');
        } finally {
            setIsPosting(false);
        }
    };
>>>>>>> teammate/main

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateAdminSettings(settings);
<<<<<<< HEAD
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
=======
            addNotification('Saved', 'Settings updated successfully', 'success');
        } catch { addNotification('Error', 'Failed to save settings', 'error'); }
        finally { setIsSaving(false); }
    };

    // ── Access guard ───────────────────────────────────────────────────────
    if (isAccessDenied && !user?.is_admin && !hasSecretAccess) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }} className="container fadeIn">
                <ShieldAlert size={72} color="#ee1c24" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Restricted Area</h1>
                <p style={{ color: '#666', maxWidth: '480px', margin: '1rem auto', fontSize: '1.1rem' }}>
                    This console is for authorized administrators only.
>>>>>>> teammate/main
                </p>
                <button onClick={() => window.location.href = '/'} className="btn btn-primary">Return to Marketplace</button>
            </div>
        );
    }

<<<<<<< HEAD
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
=======
    // ── Filtered data ──────────────────────────────────────────────────────
    const q = search.toLowerCase();
    const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    const filteredProducts = products.filter(p => p.title?.toLowerCase().includes(q) || p.seller_name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    const filteredPosts = posts.filter(p => p.type !== 'announcement').filter(p => p.content?.toLowerCase().includes(q) || p.author_name?.toLowerCase().includes(q));
    const adminPosts = posts.filter(p => p.type === 'announcement').filter(p => p.content?.toLowerCase().includes(q) || p.author_name?.toLowerCase().includes(q));
    const filteredLogs = logs.filter(l => l.full_name?.toLowerCase().includes(q) || l.action?.toLowerCase().includes(q));

    return (
        <div style={{
            display: 'flex',
            flex: 1,
            background: '#f1f5f9',
            minHeight: 'calc(100vh - 80px)', // Account for Navbar
            overflow: 'hidden',
            position: 'relative'
        }} className="fadeIn">

            {/* ── Mobile Overlay ── */}
            {isMobile && isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998, backdropFilter: 'blur(4px)' }}
                />
            )}

            {/* ── Sidebar ── */}
            <aside style={{
                width: isMobile ? '280px' : '280px',
                flexShrink: 0,
                background: '#1d3d6e',
                display: 'flex', flexDirection: 'column',
                height: '100%', overflowY: 'auto',
                borderRight: '1px solid #e2e8f0',
                zIndex: 1000,
                position: isMobile ? 'fixed' : 'relative',
                left: isMobile ? (isMobileMenuOpen ? 0 : '-280px') : 0,
                transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: 45, height: 45, borderRadius: 14, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert size={24} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 900, color: 'white', fontSize: '1.1rem', letterSpacing: -0.5 }}>CampusMart</div>
                            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>Console v2.1</div>
                        </div>
                    </div>
                    {isMobile && <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white' }}><X size={24} /></button>}
                </div>

                <nav style={{ padding: '1.5rem 1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {NAV_ITEMS.map(item => {
                        const active = activeTab === item.id;
                        return (
                            <button key={item.id} onClick={() => setActiveTab(item.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    width: '100%', padding: '1rem 1.25rem',
                                    borderRadius: 16, border: 'none',
                                    background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: active ? 'white' : 'rgba(255,255,255,0.5)',
                                    fontWeight: active ? 800 : 600,
                                    cursor: 'pointer', transition: '0.2s',
                                    textAlign: 'left', fontSize: '0.9rem'
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <item.icon size={20} style={{ opacity: active ? 1 : 0.6 }} />
                                {item.label}
                                {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'white' }}></div>}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <button onClick={() => { logout(); sessionStorage.removeItem('admin_access_unlocked'); }}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            width: '100%', padding: '1rem',
                            background: '#fee2e2', border: 'none',
                            borderRadius: 16, color: '#dc2626', cursor: 'pointer', fontWeight: 900, fontSize: '0.9rem',
                            transition: '0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

                {/* Header Section */}
                <AdminHeader
                    activeTab={activeTab}
                    search={search}
                    setSearch={setSearch}
                    onLogout={() => { logout(); sessionStorage.removeItem('admin_access_unlocked'); }}
                    onRefresh={loadData}
                    isLoading={isLoading}
                    isMobile={isMobile}
                    toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem' }}>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                            <div className="spinner" style={{ margin: '0 auto 2rem' }} />
                            <p style={{ color: '#94a3b8', fontWeight: 600 }}>Synchronizing data...</p>
                        </div>
                    ) : (
                        <div className="fadeIn">
                            {activeTab === 'overview' && <Overview stats={stats} setActiveTab={setActiveTab} />}
                            {activeTab === 'users' && <UserManagement users={filteredUsers} onBan={handleToggleBan} onRoleUpdate={handleRoleUpdate} onVerify={handleToggleVerification} onDelete={handleDeleteUser} />}
                            {activeTab === 'products' && <ProductControl products={filteredProducts} onToggle={handleToggleProduct} onDelete={handleDeleteProduct} />}
                            {activeTab === 'community' && <CommunityPosts posts={filteredPosts} onDelete={handleDeletePost} products={products} setProducts={setProducts} loadData={loadData} addNotification={addNotification} />}
                            {activeTab === 'announcements' && <Announcements adminPosts={adminPosts} announcementText={announcementText} setAnnouncementText={setAnnouncementText} onPost={handlePostAnnouncement} isPosting={isPosting} onDelete={handleDeletePost} />}
                            {activeTab === 'logs' && <ActivityLogs logs={filteredLogs} />}
                            {activeTab === 'settings' && <SiteSettings settings={settings} setSettings={setSettings} onSave={handleSaveSettings} isSaving={isSaving} />}
                        </div>
                    )}
                </div>
>>>>>>> teammate/main
            </main>
        </div>
    );
};

<<<<<<< HEAD
const StatCard = ({ title, value, trend, icon: Icon, color }) => (
    <div style={{ background: 'white', borderRadius: '32px', padding: '2.5rem', boxShadow: '0 4px 25px rgba(0,0,0,0.02)', border: '1px solid #eef2f7', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '100px', height: '100px', background: `${color}10`, borderRadius: '50%' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={30} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 900, color: trend.startsWith('+') ? '#38a169' : '#f56565', background: trend.startsWith('+') ? '#f0fff4' : '#fff5f5', padding: '0.4rem 0.75rem', borderRadius: '10px' }}>{trend}</div>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#a0aec0', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '2.25rem', fontWeight: 950, color: '#1a202c', letterSpacing: '-0.03em' }}>{value}</div>
=======
// ═══════════════════════════════════════════════════════════════════════════════
//  OVERVIEW (Enhanced for Seamless Management)
// ═══════════════════════════════════════════════════════════════════════════════
const Overview = ({ stats, setActiveTab }) => {
    if (!stats) return <EmptyState text="No stats available." />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Row: Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                {[
                    { label: 'Platform Users', value: stats.overview?.total_users ?? 0, icon: Users, color: '#4f46e5', bg: '#eef2ff', note: 'Registered members' },
                    { label: 'Market Inventory', value: stats.overview?.total_products ?? 0, icon: ShoppingBag, color: '#059669', bg: '#ecfdf5', note: 'Active listings' },
                    { label: 'Trade Success', value: stats.overview?.successful_sales ?? 0, icon: CheckCircle, color: '#16a34a', bg: '#dcfce7', note: 'Completed deals' },
                    { label: 'Pending Safety', value: stats.overview?.pending_approvals ?? 0, icon: EyeOff, color: '#d97706', bg: '#fffbeb', note: 'Requires attention' },
                    { label: 'Recent Velocity', value: (stats.overview?.users_today ?? 0) + (stats.overview?.products_today ?? 0), icon: TrendingUp, color: '#0ea5e9', bg: '#f0f9ff', note: 'New items today' },
                ].map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 18, padding: '1.5rem', border: '1px solid #e2e8f0', transition: '0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: '1rem' }}>
                            <c.icon size={20} />
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#111827', margin: '0.25rem 0' }}>{c.value.toLocaleString()}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{c.note}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Console Actions */}
                    <div style={{ background: 'white', borderRadius: 24, padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Zap size={20} color="#1d3d6e" /> Quick Actions
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {[
                                { label: 'Broadcast', icon: Megaphone, color: '#4f46e5', tab: 'announcements' },
                                { label: 'Security', icon: Activity, color: '#0ea5e9', tab: 'logs' },
                            ].map((btn, idx) => (
                                <button key={idx} onClick={() => setActiveTab(btn.tab)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: 18, border: '1px solid #f1f5f9', background: '#fcfdfe', cursor: 'pointer', transition: '0.2s' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 14, background: `${btn.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: btn.color }}>
                                        <btn.icon size={22} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#374151' }}>{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', borderRadius: 24, padding: '1.75rem', border: '1px solid #e2e8f0', flex: 1 }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', marginBottom: '1rem' }}>Platform Pulse</h3>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>System is performing within normal parameters. Community activity and market listings are synchronized.</p>
                    </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1d3d6e 0%, #2d5fa0 100%)',
                        borderRadius: 20, padding: '1.75rem', color: 'white',
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(29,61,110,0.15)'
                    }}>
                        <Activity size={120} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, color: 'white' }} />
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} /> Data Overview
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 1 }}>
                            {[
                                { label: 'Active Members', value: stats.overview?.total_users ?? 0, icon: Users, color: '#fcd34d' },
                                { label: 'Daily Signups', value: stats.overview?.users_today ?? 0, icon: Users, color: '#93c5fd' },
                                { label: 'Trade Success', value: stats.overview?.successful_sales ?? 0, icon: CheckCircle, color: '#4ade80' },
                                { label: 'New Listings', value: stats.overview?.products_today ?? 0, icon: Package, color: '#93c5fd' },
                                { label: 'Flagged Items', value: stats.overview?.pending_approvals ?? 0, icon: EyeOff, color: '#f87171' },
                            ].map((row, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <row.icon size={14} style={{ opacity: 0.7, color: row.color }} />
                                        <span style={{ opacity: 0.9, fontSize: '0.8rem', fontWeight: 600 }}>{row.label}</span>
                                    </div>
                                    <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderRadius: 24, padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111827', marginBottom: '1.25rem' }}>Diagnostics</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>API Endpoint</span>
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 900 }}>ONLINE</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Database Sync</span>
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 900 }}>SYNCHRONIZED</span>
                    </div>
                </div>
            </div>
        </div>
    );
};



// ═══════════════════════════════════════════════════════════════════════════════
//  USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
const UserManagement = ({ users, onBan, onRoleUpdate, onVerify, onDelete }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Total Members <span style={{ color: '#64748b' }}>({users.length})</span></span>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                        {['Member', 'Privilege', 'Account Status', 'Premium', 'Joined', 'Action'].map(h => (
                            <th key={h} style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr><td colSpan={6}><EmptyState text="No members found matching your search." /></td></tr>
                    )}
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fcfdfe'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d3d6e', flexShrink: 0 }}>
                                        {u.full_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#111827' }}>{u.full_name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{u.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <select value={String(u.is_admin)} onChange={e => onRoleUpdate(u.id, e.target.value === 'true')}
                                    style={{ padding: '0.4rem 0.75rem', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700, background: u.is_admin ? '#fffbeb' : 'white', color: u.is_admin ? '#b45309' : '#475569', cursor: 'pointer', outline: 'none' }}>
                                    <option value="false">Member</option>
                                    <option value="true">Admin</option>
                                </select>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ padding: '0.4rem 0.85rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 800, background: u.is_banned ? '#fee2e2' : '#dcfce7', color: u.is_banned ? '#dc2626' : '#16a34a' }}>
                                    {u.is_banned ? 'BANNED' : 'ACTIVE'}
                                </span>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <button onClick={() => onVerify(u.id)}
                                    style={{ padding: '0.4rem 0.85rem', borderRadius: 10, border: `2px solid ${u.is_verified ? '#fbbf24' : '#e2e8f0'}`, background: u.is_verified ? '#fffbeb' : 'white', color: u.is_verified ? '#b45309' : '#94a3b8', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', transition: '0.2s' }}>
                                    {u.is_verified ? '★ VERIFIED' : 'UNVERIFIED'}
                                </button>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                                {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => onBan(u.id, u.is_banned)}
                                        style={{ padding: '0.5rem 0.85rem', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', background: u.is_banned ? '#dcfce7' : '#fee2e2', color: u.is_banned ? '#16a34a' : '#dc2626', transition: '0.2s', flex: 1 }}>
                                        {u.is_banned ? 'UNBAN' : 'BAN'}
                                    </button>
                                    <button onClick={() => onDelete(u.id)}
                                        title="DELETE PERMANENTLY"
                                        style={{ padding: '0.5rem', borderRadius: 10, border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCT CONTROL
// ═══════════════════════════════════════════════════════════════════════════════
const ProductControl = ({ products, onToggle, onDelete }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Market Inventory <span style={{ color: '#64748b' }}>({products.length})</span></span>
        </div>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                        {['Item', 'Seller', 'Category', 'Price', 'Stats', 'Visibility', 'Commands'].map(h => (
                            <th key={h} style={{ padding: '1rem 1.5rem', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.length === 0 && (
                        <tr><td colSpan={7}><EmptyState text="No products found matching your search." /></td></tr>
                    )}
                    {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fcfdfe'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {p.image_url
                                        ? <img src={p.image_url} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #eee' }} />
                                        : <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><ShoppingBag size={20} color="#94a3b8" /></div>
                                    }
                                    <div style={{ fontWeight: 700, color: '#111827', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                                </div>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#475569', fontWeight: 600 }}>{p.seller_name}</td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ padding: '0.35rem 0.75rem', borderRadius: 10, background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>{p.category?.toUpperCase()}</span>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem', fontWeight: 900, color: '#059669', fontSize: '1rem' }}>KSh {Number(p.price).toLocaleString()}</td>
                            <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 700 }}>{p.views ?? 0} VIEWS</td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <span style={{ padding: '0.4rem 0.85rem', borderRadius: 99, fontSize: '0.7rem', fontWeight: 800, background: p.is_approved ? '#dcfce7' : '#fee2e2', color: p.is_approved ? '#16a34a' : '#dc2626' }}>
                                    {p.is_approved ? 'LIVE' : 'HIDDEN'}
                                </span>
                            </td>
                            <td style={{ padding: '1.25rem 1.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => onToggle(p.id)} style={{ padding: '0.5rem 0.85rem', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', background: p.is_approved ? '#fff7ed' : '#f1f5f9', color: p.is_approved ? '#ea580c' : '#1d3d6e', transition: '0.2s' }}>
                                        {p.is_approved ? 'DEACTIVATE' : 'AUTHORIZE'}
                                    </button>
                                    <button onClick={() => onDelete(p.id)} title="Delete permanently" style={{ padding: '0.5rem', borderRadius: 10, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  COMMUNITY POSTS
// ═══════════════════════════════════════════════════════════════════════════════
const CommunityPosts = ({ posts, onDelete, products, setProducts, loadData, addNotification }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Member Discussions <span style={{ color: '#64748b' }}>({posts.length})</span></span>
        </div>
        {posts.length === 0 && <EmptyState text="No posts found matching your search." />}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map(post => (
                <div key={post.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', padding: '1.75rem', borderBottom: '1px solid #f1f5f9', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfdfe'}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: post.is_admin ? '#eff6ff' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: post.is_admin ? '#2563eb' : '#475569', flexShrink: 0, fontSize: '1rem' }}>
                        {post.author_name?.charAt(0) || 'U'}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{post.author_name || 'Anonymous Member'}</span>
                            <span style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: 99, fontWeight: 800 }}>{post.type?.toUpperCase()}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto', fontWeight: 500 }}>{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{post.content}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>❤️ {post.likes ?? 0} Likes</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>💬 {post.comments ?? 0} Comments</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button onClick={() => onDelete(post.id)} title="Delete Post" style={{ padding: '0.6rem', borderRadius: 12, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', flexShrink: 0, transition: '0.2s' }}>
                            <Trash2 size={18} />
                        </button>
                        <button onClick={async (e) => {
                            const btn = e.currentTarget;
                            if (!window.confirm(`Delete ALL products by ${post.author_name}?`)) return;
                            btn.disabled = true;
                            try {
                                // Ensure products are loaded if we're not in the products tab
                                if (products.length === 0) {
                                    const allProducts = await api.getAdminProducts();
                                    setProducts(allProducts);
                                }

                                const authorProducts = products.filter(p => p.seller_id === post.author_id);
                                if (authorProducts.length === 0) {
                                    addNotification('Info', 'No products found for this author', 'info');
                                    return;
                                }

                                for (const p of authorProducts) {
                                    await api.deleteAdminProduct(p.id);
                                }
                                addNotification('Success', `Removed ${authorProducts.length} products by author`, 'success');
                                loadData();
                            } catch {
                                addNotification('Error', 'Failed to delete products', 'warning');
                            } finally {
                                btn.disabled = false;
                            }
                        }}
                            title="Delete Author Products"
                            style={{ padding: '0.6rem', borderRadius: 12, border: 'none', background: '#fffbeb', color: '#b45309', cursor: 'pointer', flexShrink: 0, transition: '0.2s' }}>
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  ANNOUNCEMENTS
// ═══════════════════════════════════════════════════════════════════════════════
const Announcements = ({ adminPosts, announcementText, setAnnouncementText, onPost, isPosting, onDelete }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Compose Announcement */}
        <div style={{ background: 'white', borderRadius: 24, border: '2px solid #1d3d6e', overflow: 'hidden', boxShadow: '0 10px 30px rgba(29,61,110,0.1)' }}>
            <div style={{ background: 'linear-gradient(135deg, #1d3d6e, #2d5fa0)', padding: '1.75rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontWeight: 900, fontSize: '1.25rem' }}>
                    <Megaphone size={24} /> Broadcast Announcement
                </div>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0.5rem 0 0', fontSize: '0.9rem', fontWeight: 500 }}>
                    Official broadcasts are pinned at the top of the community feed with premium admin branding.
                </p>
            </div>
            <form onSubmit={onPost} style={{ padding: '2rem' }}>
                <textarea
                    value={announcementText}
                    onChange={e => setAnnouncementText(e.target.value)}
                    placeholder="Compose an official announcement for all students...&#10;&#10;E.g. Safety reminders, maintenance updates, or platform news."
                    rows={8}
                    required
                    style={{ width: '100%', padding: '1.25rem', borderRadius: 16, border: '2px solid #f1f5f9', fontSize: '1.05rem', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6, background: '#fcfdfe', transition: '0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#1d3d6e'}
                    onBlur={e => e.target.style.borderColor = '#f1f5f9'}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                        <ShieldAlert size={16} /> Visible to ALL active members
                    </div>
                    <button type="submit" disabled={isPosting || !announcementText.trim()}
                        style={{
                            padding: '1rem 2.5rem', background: isPosting || !announcementText.trim() ? '#cbd5e1' : '#1d3d6e',
                            color: 'white', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: '1.1rem',
                            cursor: isPosting || !announcementText.trim() ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.75rem', transition: '0.3s transform, 0.3s background',
                            boxShadow: '0 8px 20px rgba(29,61,110,0.2)'
                        }}
                    >
                        <Megaphone size={20} />
                        {isPosting ? 'BROADCASTING...' : 'PUBLISH NOW'}
                    </button>
                </div>
            </form>
        </div>

        {/* History */}
        <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Previous Broadcasts <span style={{ color: '#64748b' }}>({adminPosts.length})</span></span>
            </div>
            {adminPosts.length === 0 && <EmptyState text="No previous announcements found." />}
            {adminPosts.map(post => (
                <div key={post.id} style={{ display: 'flex', gap: '1.25rem', padding: '1.75rem', borderBottom: '1px solid #f1f5f9', alignItems: 'flex-start', background: '#fcfdfe' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                        <Megaphone size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#374151', fontSize: '1rem', lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{post.content}</p>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.8rem', fontWeight: 600 }}>❤️ {post.likes ?? 0} Likes &nbsp;•&nbsp; 💬 {post.comments ?? 0} Comments</div>
                    </div>
                    <button onClick={() => onDelete(post.id)} style={{ padding: '0.6rem', borderRadius: 12, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', flexShrink: 0, transition: '0.2s' }}>
                        <Trash2 size={18} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  ACTIVITY LOGS
// ═══════════════════════════════════════════════════════════════════════════════
const ActivityLogs = ({ logs }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>System Activity <span style={{ color: '#64748b' }}>({logs.length})</span></span>
        </div>
        {logs.length === 0 && <EmptyState text="No activity logs found for your search." />}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {logs.map(log => {
                const isDelete = log.action?.includes('delete');
                const isBan = log.action?.includes('ban');
                const isAuth = log.action?.includes('login') || log.action?.includes('signup');
                const color = isDelete ? '#dc2626' : isBan ? '#d97706' : isAuth ? '#2563eb' : '#059669';
                const bg = isDelete ? '#fee2e2' : isBan ? '#fffbeb' : isAuth ? '#eff6ff' : '#ecfdf5';
                return (
                    <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem 1.75rem', borderBottom: '1px solid #f8fafc', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#fcfdfe'}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Activity size={18} color={color} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{log.full_name || 'Anonymous User'}</span>
                            <span style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0.5rem' }}>executed</span>
                            <span style={{ fontWeight: 900, color, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5, background: bg, padding: '0.25rem 0.6rem', borderRadius: '6px' }}>
                                {log.action?.replace(/_/g, ' ')}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', flexShrink: 0, fontWeight: 600 }}>{new Date(log.created_at).toLocaleString()}</div>
                    </div>
                );
            })}
        </div>
    </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
//  SITE SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
const SiteSettings = ({ settings, setSettings, onSave, isSaving }) => (
    <form onSubmit={onSave} style={{ maxWidth: 800 }}>
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 900, color: '#111827', fontSize: '1.25rem' }}>Global Meta Configuration</span>
                <p style={{ color: '#64748b', margin: '0.5rem 0 0', fontSize: '0.9rem', fontWeight: 500 }}>Configure primary platform parameters and site visibility.</p>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Platform Title</label>
                    <input value={settings.site_name} onChange={e => setSettings({ ...settings, site_name: e.target.value })}
                        style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: 14, border: '2px solid #f1f5f9', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', background: '#fcfdfe', transition: '0.2s', fontWeight: 600 }}
                        onFocus={e => e.target.style.borderColor = '#1d3d6e'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Official Support Email</label>
                    <input value={settings.contact_email} onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                        type="email" placeholder="support@campusmart.com"
                        style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: 14, border: '2px solid #f1f5f9', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', background: '#fcfdfe', transition: '0.2s', fontWeight: 600 }}
                        onFocus={e => e.target.style.borderColor = '#1d3d6e'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: 800, fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Global Broadcast Banner (Homepage)</label>
                    <textarea value={settings.announcement} onChange={e => setSettings({ ...settings, announcement: e.target.value })}
                        rows={3} placeholder="Banner message shown to all non-logged in or guest users on the main landing..."
                        style={{ width: '100%', padding: '1rem 1.25rem', borderRadius: 14, border: '2px solid #f1f5f9', fontSize: '1rem', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#fcfdfe', transition: '0.2s', fontWeight: 600, lineHeight: 1.5 }}
                        onFocus={e => e.target.style.borderColor = '#1d3d6e'} onBlur={e => e.target.style.borderColor = '#f1f5f9'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderRadius: 16, background: settings.maintenance_mode === 'true' ? '#fff1f2' : '#f0fdf4', border: `2px solid ${settings.maintenance_mode === 'true' ? '#fecaca' : '#bbf7d0'}`, transition: '0.3s' }}>
                    <div>
                        <div style={{ fontWeight: 900, color: settings.maintenance_mode === 'true' ? '#e11d48' : '#16a34a', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem' }}>
                            {settings.maintenance_mode === 'true' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                            {settings.maintenance_mode === 'true' ? 'SYSTEM MAINTENANCE ACTIVE' : 'SYSTEM IS LIVE & OPERATIONAL'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: settings.maintenance_mode === 'true' ? '#9f1239' : '#166534', fontWeight: 600 }}>When active, normal user access is disabled. Only admins can enter.</div>
                    </div>
                    <select value={settings.maintenance_mode} onChange={e => setSettings({ ...settings, maintenance_mode: e.target.value })}
                        style={{ padding: '0.75rem 1.25rem', borderRadius: 12, border: '2px solid #e2e8f0', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem', outline: 'none', background: 'white' }}>
                        <option value="false">PUBLIC (OFF)</option>
                        <option value="true">MAINTENANCE (ON)</option>
                    </select>
                </div>
            </div>
        </div>
        <button type="submit" disabled={isSaving}
            style={{ marginTop: '2rem', padding: '1.25rem 3.5rem', background: isSaving ? '#cbd5e1' : '#1d3d6e', color: 'white', border: 'none', borderRadius: 18, fontWeight: 900, fontSize: '1.1rem', cursor: isSaving ? 'not-allowed' : 'pointer', transition: '0.3s', boxShadow: '0 8px 16px rgba(29,61,110,0.2)' }}>
            {isSaving ? 'SYNCHRONIZING...' : 'COMMIT ALL SETTINGS'}
        </button>
    </form>
);

// ─── Shared Helper ────────────────────────────────────────────────────────────
const EmptyState = ({ text }) => (
    <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8', fontSize: '1rem', fontWeight: 600, background: 'rgba(255,255,255,0.5)', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
        <div style={{ marginBottom: '1rem', opacity: 0.5 }}><Search size={48} style={{ margin: '0 auto' }} /></div>
        {text}
>>>>>>> teammate/main
    </div>
);

export default AdminDashboard;
