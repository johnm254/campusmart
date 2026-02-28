import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import {
    Users, ShoppingBag, Settings, ShieldAlert, MessageSquare,
    Search, CheckCircle, Clock, AlertTriangle, Activity,
    LayoutDashboard, Megaphone, Trash2, RefreshCw, LogOut,
    ChevronRight, TrendingUp, Package, X, Filter, EyeOff
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
const SearchToggle = ({ value, onChange, placeholder, activeTab }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-expand if there's a value
    useEffect(() => {
        if (value) setIsExpanded(true);
    }, [value]);

    if (!isExpanded && !value) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1rem', background: 'white',
                    border: '1px solid #e2e8f0', borderRadius: '10px',
                    cursor: 'pointer', color: '#64748b', fontSize: '0.85rem',
                    fontWeight: 700, transition: '0.2s', marginBottom: '1.5rem'
                }}
            >
                <Search size={16} /> Search {activeTab}
            </button>
        );
    }

    return (
        <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '600px' }} className="fadeIn">
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
                autoFocus
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={e => onChange(e.target.value)}
                style={{ width: '100%', padding: '0.85rem 2.75rem', borderRadius: 12, border: '2px solid #1d3d6e', background: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(29,61,110,0.1)' }}
            />
            <button
                onClick={() => { onChange(''); setIsExpanded(false); }}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '4px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
            >
                <X size={14} />
            </button>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { user, addNotification, logout } = useApp();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({ site_name: 'CampusMart', maintenance_mode: 'false', contact_email: '', announcement: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [search, setSearch] = useState('');
    const [announcementText, setAnnouncementText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const hasSecretAccess = sessionStorage.getItem('admin_access_unlocked') === 'true';

    // ── Load data per tab ──────────────────────────────────────────────────
    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'overview') {
                const data = await api.getAdminStats();
                setStats(data);
            } else if (activeTab === 'users') {
                const data = await api.getAdminUsers();
                setUsers(Array.isArray(data) ? data : []);
            } else if (activeTab === 'products') {
                const data = await api.getAdminProducts();
                setProducts(Array.isArray(data) ? data : []);
            } else if (activeTab === 'community' || activeTab === 'announcements') {
                const data = await api.getAdminCommunityPosts();
                setPosts(Array.isArray(data) ? data : []);
            } else if (activeTab === 'logs') {
                const data = await api.getAdminLogs();
                setLogs(Array.isArray(data) ? data : []);
            } else if (activeTab === 'settings') {
                const data = await api.getAdminSettings();
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            addNotification('Error', err.message || 'Failed to load data', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        if (!user?.is_admin && !hasSecretAccess) return;
        loadData();
    }, [user, activeTab, hasSecretAccess, loadData]);

    // ── Handlers ───────────────────────────────────────────────────────────
    const handleToggleBan = async (userId, isBanned) => {
        if (!confirm(`${isBanned ? 'Unban' : 'Ban'} this user?`)) return;
        try {
            const res = await api.toggleUserBan(userId);
            addNotification('Updated', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Action failed', 'error'); }
    };

    const handleRoleUpdate = async (userId, isAdmin) => {
        try {
            const res = await api.updateUserRole(userId, isAdmin);
            addNotification('Role Updated', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Update failed', 'error'); }
    };

    const handleToggleVerification = async (userId) => {
        try {
            const res = await api.toggleUserVerification(userId);
            addNotification('Verified', res.message, 'success');
            loadData();
        } catch { addNotification('Error', 'Action failed', 'error'); }
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
            const res = await fetch(`${api.baseUrl}/admin/announcements`, {
                method: 'POST',
                headers: { ...api.getAdminHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: announcementText.trim() })
            });
            const data = await res.json();
            if (res.ok) {
                addNotification('Published! 📣', 'Announcement is now live in the Community', 'success');
                setAnnouncementText('');
                setActiveTab('announcements');
                loadData();
            } else {
                addNotification('Failed', data.message || 'Could not post announcement', 'error');
            }
        } catch (err) {
            addNotification('Error', 'Network error — is the backend running?', 'error');
        } finally {
            setIsPosting(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateAdminSettings(settings);
            addNotification('Saved', 'Settings updated successfully', 'success');
        } catch { addNotification('Error', 'Failed to save settings', 'error'); }
        finally { setIsSaving(false); }
    };

    // ── Access guard ───────────────────────────────────────────────────────
    if (!user?.is_admin && !hasSecretAccess) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 20px' }} className="container fadeIn">
                <ShieldAlert size={72} color="#ee1c24" style={{ marginBottom: '1.5rem' }} />
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Restricted Area</h1>
                <p style={{ color: '#666', maxWidth: '480px', margin: '1rem auto', fontSize: '1.1rem' }}>
                    This console is for authorized administrators only.
                </p>
                <button onClick={() => window.location.href = '/'} className="btn btn-primary">Return to Marketplace</button>
            </div>
        );
    }

    // ── Filtered data ──────────────────────────────────────────────────────
    const q = search.toLowerCase();
    const filteredUsers = users.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    const filteredProducts = products.filter(p => p.title?.toLowerCase().includes(q) || p.seller_name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    const filteredPosts = posts.filter(p => p.type !== 'announcement').filter(p => p.content?.toLowerCase().includes(q) || p.author_name?.toLowerCase().includes(q));
    const adminPosts = posts.filter(p => p.type === 'announcement').filter(p => p.content?.toLowerCase().includes(q) || p.author_name?.toLowerCase().includes(q));
    const filteredLogs = logs.filter(l => l.full_name?.toLowerCase().includes(q) || l.action?.toLowerCase().includes(q));

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 80px)', background: '#f8fafc', overflow: 'hidden' }} className="fadeIn">

            {/* ── Sidebar ── */}
            <aside style={{
                width: '280px', flexShrink: 0,
                background: 'linear-gradient(180deg, #1d3d6e 0%, #0f2744 100%)',
                display: 'flex', flexDirection: 'column',
                height: '100%', overflowY: 'auto',
                boxShadow: '4px 0 12px rgba(0,0,0,0.08)'
            }}>
                <div style={{ padding: '2rem 1.5rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert size={22} color="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>CampusMart</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}>ADMIN CONSOLE</div>
                        </div>
                    </div>
                </div>

                <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
                    {NAV_ITEMS.map(item => {
                        const active = activeTab === item.id;
                        return (
                            <button key={item.id} onClick={() => { setActiveTab(item.id); setSearch(''); }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.85rem',
                                    width: '100%', padding: '0.85rem 1rem',
                                    borderRadius: 12, border: 'none',
                                    background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                                    color: active ? 'white' : 'rgba(255,255,255,0.55)',
                                    fontWeight: active ? 700 : 500,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    marginBottom: '0.2rem', textAlign: 'left', fontSize: '0.9rem'
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <item.icon size={18} />
                                {item.label}
                                {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ padding: '1rem 1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>Administrator</div>
                        </div>
                    </div>
                    <button onClick={logout} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        width: '100%', padding: '0.65rem',
                        background: 'rgba(238,28,36,0.15)', border: '1px solid rgba(238,28,36,0.3)',
                        borderRadius: 10, color: '#ff9090', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem'
                    }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* ── Main Area ── */}
            <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>

                {/* Page Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', marginBottom: '0.2rem' }}>
                            {NAV_ITEMS.find(n => n.id === activeTab)?.label}
                        </h1>
                        <p style={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem' }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={loadData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', color: '#444' }}>
                            <RefreshCw size={15} /> Reload Core
                        </button>
                    </div>
                </div>

                {/* ── Search Toggle UI — shown on every tab except overview & settings ── */}
                {activeTab !== 'overview' && activeTab !== 'settings' && (
                    <SearchToggle
                        activeTab={NAV_ITEMS.find(n => n.id === activeTab)?.label}
                        value={search}
                        onChange={setSearch}
                        placeholder={
                            activeTab === 'users' ? 'Search by name or email...' :
                                activeTab === 'products' ? 'Search by title, seller or category...' :
                                    activeTab === 'community' ? 'Search posts or authors...' :
                                        activeTab === 'announcements' ? 'Search previous announcements...' :
                                            activeTab === 'logs' ? 'Search action logs...' : 'Search...'
                        }
                    />
                )}

                {/* Content */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                        <div className="spinner" style={{ margin: '0 auto 2rem' }} />
                        <p style={{ color: '#94a3b8', fontWeight: 600 }}>Syncing core data...</p>
                    </div>
                ) : (
                    <div className="fadeIn">
                        {activeTab === 'overview' && <Overview stats={stats} />}
                        {activeTab === 'users' && <UserManagement users={filteredUsers} onBan={handleToggleBan} onRoleUpdate={handleRoleUpdate} onVerify={handleToggleVerification} />}
                        {activeTab === 'products' && <ProductControl products={filteredProducts} onToggle={handleToggleProduct} onDelete={handleDeleteProduct} />}
                        {activeTab === 'community' && <CommunityPosts posts={filteredPosts} onDelete={handleDeletePost} />}
                        {activeTab === 'announcements' && <Announcements adminPosts={adminPosts} announcementText={announcementText} setAnnouncementText={setAnnouncementText} onPost={handlePostAnnouncement} isPosting={isPosting} onDelete={handleDeletePost} />}
                        {activeTab === 'logs' && <ActivityLogs logs={filteredLogs} />}
                        {activeTab === 'settings' && <SiteSettings settings={settings} setSettings={setSettings} onSave={handleSaveSettings} isSaving={isSaving} />}
                    </div>
                )}
            </main>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
//  OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const Overview = ({ stats }) => {
    if (!stats) return <EmptyState text="No stats available." />;

    const cards = [
        { label: 'Total Users', value: stats.overview?.total_users ?? 0, icon: Users, color: '#4f46e5', bg: '#eef2ff', note: 'Registered students' },
        { label: 'Market Listings', value: stats.overview?.total_products ?? 0, icon: Package, color: '#059669', bg: '#ecfdf5', note: 'Active products' },
        { label: 'Hidden Listings', value: stats.overview?.pending_approvals ?? 0, icon: EyeOff, color: '#d97706', bg: '#fffbeb', note: 'Deactivated by admin' },
        { label: 'Daily Activity', value: (stats.overview?.users_today ?? 0) + (stats.overview?.products_today ?? 0), icon: TrendingUp, color: '#0ea5e9', bg: '#f0f9ff', note: 'New users + products' },
    ];

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {cards.map((c, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: 18, padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: '1.25rem' }}>
                            <c.icon size={22} />
                        </div>
                        <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#111827', lineHeight: 1, marginBottom: '0.35rem' }}>{c.value.toLocaleString()}</div>
                        <div style={{ color: '#111827', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{c.label}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{c.note}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Recent Users */}
                <div style={{ background: 'white', borderRadius: 20, padding: '1.75rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Recent Registrations</h3>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>Last 5 Users</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {(stats.recent_users || []).map((u, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', borderRadius: '12px', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#1d3d6e', flexShrink: 0, fontSize: '0.9rem' }}>
                                    {u.full_name?.charAt(0)}
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{u.full_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(u.created_at).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Summary */}
                <div style={{ background: 'linear-gradient(135deg, #1d3d6e, #2d5fa0)', borderRadius: 20, padding: '2rem', color: 'white', boxShadow: '0 10px 25px rgba(29,61,110,0.2)' }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} /> Dashboard Summary
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { label: 'Registrations Today', value: stats.overview?.users_today ?? 0, icon: Users },
                            { label: 'Products Today', value: stats.overview?.products_today ?? 0, icon: Package },
                            { label: 'Deactivated Items', value: stats.overview?.pending_approvals ?? 0, icon: EyeOff },
                            { label: 'Total Marketplace', value: stats.overview?.total_products ?? 0, icon: ShoppingBag },
                            { label: 'Platform Users', value: stats.overview?.total_users ?? 0, icon: Users },
                        ].map((row, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <row.icon size={16} style={{ opacity: 0.7 }} />
                                    <span style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: 500 }}>{row.label}</span>
                                </div>
                                <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>{row.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};



// ═══════════════════════════════════════════════════════════════════════════════
//  USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════
const UserManagement = ({ users, onBan, onRoleUpdate, onVerify }) => (
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
                                    <option value="false">Standard</option>
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
                                <button onClick={() => onBan(u.id, u.is_banned)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer', background: u.is_banned ? '#dcfce7' : '#fee2e2', color: u.is_banned ? '#16a34a' : '#dc2626', transition: '0.2s' }}>
                                    {u.is_banned ? 'UNBAN' : 'BAN USER'}
                                </button>
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
const CommunityPosts = ({ posts, onDelete }) => (
    <div style={{ background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Student Discussions <span style={{ color: '#64748b' }}>({posts.length})</span></span>
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
                            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{post.author_name || 'Anonymous Student'}</span>
                            {post.is_admin && <span style={{ fontSize: '0.65rem', background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: 99, fontWeight: 900, letterSpacing: 0.5 }}>ADMIN</span>}
                            <span style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: 99, fontWeight: 800 }}>{post.type?.toUpperCase()}</span>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto', fontWeight: 500 }}>{new Date(post.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{post.content}</p>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>❤️ {post.likes ?? 0} Likes</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>💬 {post.comments ?? 0} Comments</span>
                        </div>
                    </div>
                    <button onClick={() => onDelete(post.id)} style={{ padding: '0.6rem', borderRadius: 12, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', flexShrink: 0, transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.scale = '1.05'} onMouseLeave={e => e.currentTarget.style.scale = '1'}>
                        <Trash2 size={18} />
                    </button>
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
                            <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.8rem', borderRadius: 99, fontWeight: 900, letterSpacing: 0.5 }}>OFFICIAL BROADCAST</span>
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
    </div>
);

export default AdminDashboard;
