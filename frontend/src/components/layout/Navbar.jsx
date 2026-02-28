import React, { useState } from 'react';
import { useApp } from '../../AppContext';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, Tag, MessageSquare, Settings as SettingsIcon, Heart, Users, Home, Store, Building2, DoorOpen, ShieldCheck } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Navbar = ({ onOpenAuth, onOpenSell }) => {
    const { user, wishlist, setCurrentPage, currentPage, logout, unreadCount, setIsAdminLockModalOpen } = useApp();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleLogout = () => {
        logout();
        setShowAccountMenu(false);
        setShowMobileMenu(false);
    };

    const navLink = (page, label, icon = null) => (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); setCurrentPage(page); setShowMobileMenu(false); }}
            style={{
                color: currentPage === page ? 'var(--jiji-green)' : 'var(--text-primary)',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.15rem',
                padding: isMobile ? '0.75rem 0' : '0.5rem 0.25rem',
                borderBottom: isMobile ? '1px solid #f5f5f5' : 'none',
                display: isMobile ? 'flex' : 'block',
                alignItems: 'center',
                gap: isMobile ? '0.75rem' : '0',
                transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--jiji-green)'}
            onMouseOut={e => e.currentTarget.style.color = currentPage === page ? 'var(--jiji-green)' : 'var(--text-primary)'}
        >
            {isMobile && icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            {label}
        </a>
    );

    return (
        <nav style={{
            background: 'white',
            padding: isMobile ? '0.85rem 1.25rem' : '0.85rem 2.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            borderBottom: '1px solid #eee'
        }}>
            {/* Main bar */}
            <div style={{ width: '100%', margin: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>

                {/* Logo */}
                <div onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <img src="/logo.png" alt="CampusMart Logo" style={{ height: isMobile ? '30px' : '38px', objectFit: 'contain' }} />
                    <span style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <span style={{ color: 'var(--campus-blue)' }}>CAMPUS</span>
                        <span style={{ color: 'var(--jiji-green)' }}>MART</span>
                    </span>
                </div>

                {/* Desktop nav links - Moved next to right side actions */}
                {!isMobile && (
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginLeft: 'auto' }}>
                        {navLink('home', 'Discover')}
                        {navLink('marketplace', 'Marketplace')}
                        {navLink('accommodation', 'Accommodation')}
                        {navLink('community', 'Community')}
                    </div>
                )}

                {/* Right side actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem' }}>
                    {/* Sell button — visible on all screens */}
                    <button
                        className="btn btn-primary"
                        onClick={() => user ? onOpenSell() : onOpenAuth()}
                        style={{ padding: isMobile ? '0.45rem 0.9rem' : '0.5rem 1.25rem', fontSize: isMobile ? '0.8rem' : '0.9rem' }}
                    >
                        {currentPage === 'accommodation' ? '+ POST HOUSE' : '+ SELL'}
                    </button>

                    {/* Profile avatar (always visible when logged in) */}
                    {user && (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowAccountMenu(!showAccountMenu)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.15rem' }}
                            >
                                <img
                                    src={user.avatar_url || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'U')}&background=1d3d6e&color=fff`}
                                    alt="Profile"
                                    style={{ width: isMobile ? '36px' : '40px', height: isMobile ? '36px' : '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--jiji-green)' }}
                                />
                                {unreadCount > 0 && (
                                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--jiji-orange)', color: 'white', fontSize: '0.65rem', fontWeight: 900, width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showAccountMenu && (
                                <>
                                    <div onClick={() => setShowAccountMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 999 }} />
                                    <div style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 10px)',
                                        right: 0,
                                        background: 'white',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                                        minWidth: '220px',
                                        padding: '0.75rem',
                                        zIndex: 1001,
                                        border: '1px solid #f0f0f0',
                                        animation: 'slideUp 0.2s ease-out'
                                    }}>
                                        <div style={{ padding: '0.75rem 1rem', marginBottom: '0.5rem', borderBottom: '1px solid #f5f5f5' }}>
                                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--campus-blue)' }}>{user.full_name || 'Student'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{user.email}</div>
                                        </div>

                                        {[
                                            { icon: <LayoutDashboard size={16} />, label: 'My Dashboard', page: 'dashboard' },
                                            { icon: <MessageSquare size={16} />, label: 'Messages', page: 'messages' },
                                            { icon: <Heart size={16} />, label: 'Wishlist', page: 'wishlist' },
                                            { icon: <SettingsIcon size={16} />, label: 'Settings', page: 'settings' },
                                        ].map(item => (
                                            <div
                                                key={item.page}
                                                onClick={() => { setCurrentPage(item.page); setShowAccountMenu(false); }}
                                                className="menu-item-premium"
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                {item.icon} {item.label}
                                            </div>
                                        ))}

                                        <div style={{ height: '1px', background: '#f5f5f5', margin: '0.5rem 0' }} />
                                        <div
                                            onClick={() => { setIsAdminLockModalOpen(true); setShowAccountMenu(false); }}
                                            className="menu-item-premium"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1d3d6e' }}
                                        >
                                            <ShieldCheck size={16} color="#1d3d6e" /> Admin Console
                                        </div>

                                        <div style={{ height: '1px', background: '#f5f5f5', margin: '0.5rem 0' }} />
                                        <div onClick={handleLogout} style={{ color: 'var(--jiji-orange)' }} className="menu-item-premium">
                                            <LogOut size={16} /> Sign Out
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Sign In button on desktop when not logged in */}
                    {!user && !isMobile && (
                        <button onClick={onOpenAuth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, color: 'var(--campus-blue)', fontSize: '0.95rem' }}>
                            Sign In
                        </button>
                    )}

                    {/* Hamburger — mobile only */}
                    {isMobile && (
                        <button
                            style={{ background: '#f8fafc', border: 'none', cursor: 'pointer', padding: '0.45rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X size={22} color="#1d3d6e" /> : <Menu size={22} color="#1d3d6e" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile slide-down menu */}
            {isMobile && showMobileMenu && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    padding: '1rem 1.5rem 1.5rem',
                    zIndex: 998,
                    animation: 'slideUp 0.2s ease-out',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {navLink('home', 'Discover', <Home size={20} />)}
                        {navLink('marketplace', 'Marketplace', <Store size={20} />)}
                        {navLink('accommodation', 'Accommodation', <Building2 size={20} />)}
                        {navLink('community', 'Community', <Users size={20} />)}

                        {user ? (
                            <>
                                {navLink('dashboard', 'My Dashboard', <LayoutDashboard size={20} />)}
                                {navLink('messages', `Messages${unreadCount > 0 ? ` (${unreadCount})` : ''}`, <MessageSquare size={20} />)}
                                {navLink('wishlist', `Wishlist${wishlist.length > 0 ? ` (${wishlist.length})` : ''}`, <Heart size={20} />)}
                                {navLink('settings', 'Settings', <SettingsIcon size={20} />)}
                                <button
                                    onClick={() => { setIsAdminLockModalOpen(true); setShowMobileMenu(false); }}
                                    style={{ width: '100%', padding: '0.75rem', background: '#ebf2f7', border: 'none', borderRadius: '10px', color: '#1d3d6e', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}
                                >
                                    <ShieldCheck size={20} /> Admin Console
                                </button>
                                <button
                                    onClick={handleLogout}
                                    style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', background: '#fff5f5', border: 'none', borderRadius: '10px', color: 'var(--jiji-orange)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                                >
                                    <DoorOpen size={20} /> Sign Out
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => { onOpenAuth(); setShowMobileMenu(false); }}
                                className="btn btn-primary"
                                style={{ width: '100%', marginTop: '0.75rem' }}
                            >
                                Sign In / Register
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
