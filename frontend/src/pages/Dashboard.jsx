import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import { Package, Eye, Heart, MessageCircle, ArrowUpRight, Clock, Plus, Check, Star, Zap, Shield } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import BackButton from '../components/ui/BackButton';

const Dashboard = () => {
    const { user, wishlist, setCurrentPage, setIsSellModalOpen, addNotification, setIsAuthModalOpen } = useApp();
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const [myProducts, setMyProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [realStats, setRealStats] = useState({
        active_listings: 0,
        total_views: 0,
        saved_items: 0,
        total_messages: 0,
        average_rating: 0,
        review_count: 0,
        successful_sales: 0
    });
    const [reviews, setReviews] = useState([]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [productsData, statsData, reviewsData] = await Promise.all([
                api.getMyProducts(),
                api.getStats(),
                api.getUserReviews(user.id)
            ]);

            if (Array.isArray(productsData)) {
                setMyProducts(productsData);
            }
            if (statsData && !statsData.error) {
                setRealStats(statsData);
            }
            if (Array.isArray(reviewsData)) {
                setReviews(reviewsData);
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
            try {
                const res = await api.deleteProduct(id);
                if (res.message === 'Product deleted successfully') {
                    addNotification('Deleted', 'Listing removed successfully', 'info');
                    setMyProducts(prev => prev.filter(p => p.id !== id));
                    // Refresh stats after delete
                    fetchDashboardData();
                }
            } catch (err) {
                addNotification('Error', 'Failed to delete listing', 'warning');
            }
        }
    };

    const handleMarkAsSold = async (id) => {
        if (window.confirm('Mark this item as sold? It will no longer be visible in the marketplace but will count towards your successful sales.')) {
            try {
                const res = await api.markProductAsSold(id);
                if (res.message === 'Product marked as sold successfully') {
                    addNotification('Sold!', 'Listing marked as successfully sold', 'success');
                    // Update local state to reflect change or re-fetch
                    fetchDashboardData();
                }
            } catch (err) {
                addNotification('Error', 'Failed to mark as sold', 'warning');
            }
        }
    };

    const stats = [
        { label: 'Active Listings', value: (realStats?.active_listings || 0).toString(), icon: Package, color: 'var(--jiji-green)' },
        { label: 'Total Views', value: (realStats?.total_views || 0).toString(), icon: Eye, color: 'var(--campus-blue)' },
        { label: 'Saved Items', value: (realStats?.saved_items || 0).toString(), icon: Heart, color: 'var(--jiji-orange)' },
        { label: 'Sales Done', value: (realStats?.successful_sales || 0).toString(), icon: Check, color: '#16a34a' },
    ];

    if (!user) {
        return (
            <div className="container" style={{ maxWidth: '800px', textAlign: 'center', padding: isMobile ? '3rem 1.5rem' : '4rem 2rem' }}>
                <Package size={isMobile ? 60 : 80} color="#cbd5e1" style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }} />
                <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 900, color: '#111827', marginBottom: '1rem' }}>
                    Welcome to Your Dashboard
                </h2>
                <p style={{ color: '#64748b', fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
                    Please sign in to view your trading activity and manage your listings.
                </p>
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn btn-primary"
                    style={{ borderRadius: '12px', padding: isMobile ? '0.85rem 1.5rem' : '1rem 2rem', fontSize: isMobile ? '0.95rem' : '1rem' }}
                >
                    Sign In
                </button>
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#f8fafc'
        }}>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: isMobile ? '1rem 0' : '2rem 0'
            }}>
                <div className="container" style={{ maxWidth: '1300px', padding: isMobile ? '0 1rem' : '0 2rem' }}>
                    <BackButton />

                    {/* TOP HEADER SECTION */}
                    <div style={{ marginBottom: isMobile ? '2rem' : '3rem', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '1.5rem' : '0' }}>
                        <div>
                            <h1 style={{ fontSize: isMobile ? '1.75rem' : isTablet ? '2rem' : '2.5rem', fontWeight: 900, color: '#1d3d6e', letterSpacing: '-1px', marginBottom: '0.5rem' }}>
                                Habari, {user?.full_name?.split(' ')[0] || 'Comrade'}! 👋
                            </h1>
                            <p style={{ color: '#64748b', fontSize: isMobile ? '0.95rem' : '1.1rem', fontWeight: 500 }}>
                                Your campus trading hub is running smoothly.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.75rem' : '1rem', width: isMobile ? '100%' : 'auto' }}>
                            <button
                                onClick={() => setCurrentPage('messages')}
                                className="btn"
                                style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: isMobile ? '0.75rem 1.25rem' : '0.85rem 1.75rem', background: 'white', border: '1px solid #e2e8f0', color: '#1d3d6e', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', fontSize: isMobile ? '0.9rem' : '1rem' }}
                            >
                                <MessageCircle size={isMobile ? 18 : 20} /> Chats ({realStats.total_messages})
                            </button>
                            <button
                                onClick={() => setIsSellModalOpen(true)}
                                className="btn btn-primary"
                                style={{ borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: isMobile ? '0.75rem 1.25rem' : '0.85rem 1.75rem', boxShadow: '0 8px 20px rgba(238, 28, 36, 0.2)', fontSize: isMobile ? '0.9rem' : '1rem' }}
                            >
                                <Plus size={isMobile ? 18 : 20} /> New Listing
                            </button>
                        </div>
                    </div>

                    {/* METRIC CARDS */}
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: isMobile ? '1rem' : '1.5rem', marginBottom: isMobile ? '2rem' : '3rem' }}>
                        {stats.map((stat, i) => (
                            <div key={i} style={{
                                background: 'white', padding: isMobile ? '1.5rem' : '2rem', borderRadius: isMobile ? '20px' : '28px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9',
                                display: 'flex', flexDirection: 'column', position: 'relative'
                            }}>
                                <div style={{ background: stat.color + '15', color: stat.color, width: isMobile ? '44px' : '52px', height: isMobile ? '44px' : '52px', borderRadius: isMobile ? '14px' : '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: isMobile ? '1rem' : '1.5rem' }}>
                                    <stat.icon size={isMobile ? 24 : 28} />
                                </div>
                                <div style={{ fontSize: isMobile ? '0.85rem' : '1rem', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>{stat.label}</div>
                                <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 900, color: '#111827' }}>{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '2fr 1fr', gap: isMobile ? '1.5rem' : '2rem', marginBottom: isMobile ? '2rem' : '3rem' }}>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>

                            {/* MY LISTINGS SECTION */}
                            <div style={{ background: 'white', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: isMobile ? '24px' : '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? '1.5rem' : '2.5rem', gap: isMobile ? '1rem' : '0' }}>
                                    <h3 style={{ margin: 0, fontSize: isMobile ? '1.25rem' : '1.6rem', fontWeight: 900, color: '#111827' }}>My Active Listings</h3>
                                    <button
                                        onClick={() => setCurrentPage('marketplace')}
                                        style={{ background: '#f1f5f9', border: 'none', color: '#1d3d6e', fontWeight: 800, padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: isMobile ? '0.8rem' : '0.85rem', width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
                                    >
                                        Browse More <ArrowUpRight size={isMobile ? 14 : 16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.25rem' }}>
                                    {isLoading ? (
                                        <div style={{ textAlign: 'center', padding: isMobile ? '2rem' : '3rem' }}>
                                            <div className="spinner" style={{ margin: '0 auto 1.5rem' }} />
                                            <p style={{ color: '#94a3b8', fontWeight: 700, fontSize: isMobile ? '0.9rem' : '1rem' }}>Fetching inventory...</p>
                                        </div>
                                    ) : myProducts.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: isMobile ? '3rem 1.5rem' : '4rem 2rem', background: '#f8fafc', borderRadius: isMobile ? '20px' : '24px', border: '2px dashed #e2e8f0' }}>
                                            <Package size={isMobile ? 48 : 56} color="#cbd5e1" style={{ marginBottom: isMobile ? '1rem' : '1.5rem' }} />
                                            <h4 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>Nothing for sale yet?</h4>
                                            <p style={{ color: '#64748b', marginBottom: isMobile ? '1rem' : '1.5rem', fontWeight: 500, fontSize: isMobile ? '0.9rem' : '1rem' }}>Turn your unused items into cash today.</p>
                                            <button onClick={() => setIsSellModalOpen(true)} className="btn btn-secondary" style={{ borderRadius: '12px', padding: isMobile ? '0.85rem 1.5rem' : '1rem 2rem', fontSize: isMobile ? '0.9rem' : '1rem' }}>Post Your First Item</button>
                                        </div>
                                    ) : (
                                        myProducts.slice(0, 5).map((product, i) => (
                                            <div key={product.id} style={{
                                                display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '1.5rem', padding: isMobile ? '1rem' : '1.25rem',
                                                background: '#fff', borderRadius: isMobile ? '16px' : '20px', border: '1px solid #f1f5f9',
                                                alignItems: isMobile ? 'flex-start' : 'center', transition: '0.2s'
                                            }} onMouseEnter={e => e.currentTarget.style.borderColor = '#d1d5db'} onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
                                                <div style={{ width: isMobile ? '100%' : '90px', height: isMobile ? '180px' : '90px', borderRadius: isMobile ? '12px' : '16px', overflow: 'hidden', flexShrink: 0, border: '1px solid #eee' }}>
                                                    <img src={product.image_url || 'https://via.placeholder.com/90x90'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.title} />
                                                </div>
                                                <div style={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                                                        <div style={{ fontWeight: 800, fontSize: isMobile ? '1rem' : '1.15rem', color: '#111827' }}>{product.title}</div>
                                                        {product.status === 'sold' && (
                                                            <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>Sold</span>
                                                        )}
                                                    </div>
                                                    <div style={{ color: '#16a34a', fontWeight: 900, fontSize: isMobile ? '1.1rem' : '1.2rem' }}>KSh {Number(product.price).toLocaleString()}</div>
                                                    <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1.25rem', marginTop: '0.6rem', fontSize: isMobile ? '0.8rem' : '0.85rem', color: '#64748b', fontWeight: 700, flexWrap: 'wrap' }}>
                                                        <span style={{ background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{product.category}</span>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={isMobile ? 14 : 16} /> {product.views} Views</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '0.6rem', width: isMobile ? '100%' : 'auto' }}>
                                                    {product.status !== 'sold' && (
                                                        <button
                                                            onClick={() => handleMarkAsSold(product.id)}
                                                            className="btn-success"
                                                            style={{
                                                                background: '#16a34a',
                                                                color: 'white',
                                                                border: 'none',
                                                                padding: isMobile ? '0.6rem 1rem' : '0.6rem 1.2rem',
                                                                borderRadius: '12px',
                                                                fontSize: isMobile ? '0.75rem' : '0.8rem',
                                                                fontWeight: 800,
                                                                cursor: 'pointer',
                                                                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                                                                flex: isMobile ? 1 : 'none'
                                                            }}
                                                        >
                                                            Mark Sold
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: isMobile ? '0.6rem 1rem' : '0.6rem 1.2rem', borderRadius: '12px', fontSize: isMobile ? '0.75rem' : '0.8rem', fontWeight: 800, cursor: 'pointer', transition: '0.2s', flex: isMobile ? 1 : 'none' }}
                                                        onMouseOver={e => e.currentTarget.style.background = '#fecaca'}
                                                        onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* REVIEWS SECTION */}
                            <div style={{ background: 'white', padding: isMobile ? '1.5rem' : '2.5rem', borderRadius: isMobile ? '24px' : '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: isMobile ? '1.5rem' : '2rem', gap: isMobile ? '1rem' : '0' }}>
                                    <h3 style={{ margin: 0, fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900 }}>Trust Score & Feedback</h3>
                                    <div style={{ background: '#fffbeb', color: '#b45309', padding: isMobile ? '0.4rem 0.85rem' : '0.5rem 1rem', borderRadius: '16px', fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #fef3c7' }}>
                                        <Star size={isMobile ? 16 : 18} fill="#f59e0b" /> {(realStats?.average_rating || 0).toFixed(1)} Rating
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.25rem' }}>
                                    {isLoading ? (
                                        <div style={{ textAlign: 'center', padding: isMobile ? '1.5rem' : '2rem', color: '#888', fontSize: isMobile ? '0.9rem' : '1rem' }}>Syncing reviews...</div>
                                    ) : reviews.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: isMobile ? '2.5rem 1.5rem' : '3rem', background: '#f8fafc', borderRadius: isMobile ? '20px' : '24px', border: '2px dashed #e2e8f0' }}>
                                            <Star size={isMobile ? 40 : 48} color="#cbd5e1" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <p style={{ color: '#64748b', fontWeight: 700, fontSize: isMobile ? '0.9rem' : '1rem' }}>Start trading to earn reviews and build trust!</p>
                                        </div>
                                    ) : (
                                        reviews.slice(0, 3).map((review) => (
                                            <div key={review.id} style={{ display: 'flex', gap: isMobile ? '1rem' : '1.5rem', padding: isMobile ? '1rem' : '1.5rem', background: '#f8fafc', borderRadius: isMobile ? '16px' : '20px', border: '1px solid #f1f5f9' }}>
                                                <img
                                                    src={review.reviewer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=1d3d6e&color=fff`}
                                                    style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flexShrink: 0 }}
                                                    alt={review.reviewer_name}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 800, fontSize: isMobile ? '0.9rem' : '1rem', color: '#111827' }}>{review.reviewer_name}</span>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} size={isMobile ? 12 : 14} fill={review.rating >= s ? "#f59e0b" : "none"} color={review.rating >= s ? "#f59e0b" : "#cbd5e0"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: isMobile ? '0.85rem' : '0.95rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic', wordBreak: 'break-word' }}>
                                                        "{review.comment || 'Smooth transaction!'}"
                                                    </p>
                                                    <div style={{ marginTop: '0.75rem', fontSize: isMobile ? '0.75rem' : '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                                        {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR WIDGETS (Seamless Features) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1.5rem' : '2rem' }}>

                            {/* Pro Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #1d3d6e 0%, #0f172a 100%)',
                                color: 'white', padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem', borderRadius: isMobile ? '24px' : '32px',
                                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)', textAlign: 'center',
                                display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.25rem',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <Zap size={isMobile ? 60 : 80} style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }} />

                                <div style={{ background: 'rgba(255,255,255,0.1)', width: isMobile ? '56px' : '64px', height: isMobile ? '56px' : '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                    <Zap size={isMobile ? 28 : 32} color="#f59e0b" />
                                </div>

                                <div>
                                    <h3 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Comrade Power! 💪</h3>
                                    <p style={{ opacity: 0.8, fontSize: isMobile ? '0.85rem' : '0.95rem', lineHeight: 1.7, margin: 0 }}>
                                        You're part of <strong>CampusMart</strong>. Trade freely, save money, and build your campus reputation.
                                    </p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? '0.75rem' : '1rem', marginTop: '0.5rem' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: isMobile ? '14px' : '16px', padding: isMobile ? '0.85rem' : '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 900, color: '#f59e0b' }}>{realStats.active_listings}</div>
                                        <div style={{ fontSize: isMobile ? '0.65rem' : '0.7rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Items Live</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: isMobile ? '14px' : '16px', padding: isMobile ? '0.85rem' : '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ fontSize: isMobile ? '1.5rem' : '1.75rem', fontWeight: 900, color: '#f59e0b' }}>{realStats.total_views}</div>
                                        <div style={{ fontSize: isMobile ? '0.65rem' : '0.7rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Total Views</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsSellModalOpen(true)}
                                    className="btn"
                                    style={{ width: '100%', borderRadius: '14px', padding: isMobile ? '0.85rem' : '1rem', fontWeight: 800, background: '#8cc63f', color: 'white', border: 'none', cursor: 'pointer', transition: '0.2s', fontSize: isMobile ? '0.9rem' : '1rem' }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    + Post New Listing
                                </button>
                            </div>

                            {/* Quick Tips (Seamless Guidance) */}
                            <div style={{ background: 'white', padding: isMobile ? '1.5rem' : '2rem', borderRadius: isMobile ? '24px' : '32px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ marginBottom: isMobile ? '1rem' : '1.5rem', fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Shield size={isMobile ? 16 : 18} color="#16a34a" /> Pro Tips
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.25rem' }}>
                                    {[
                                        { icon: '📸', text: 'Bright, clear photos sell 3x faster than blurry ones.' },
                                        { icon: '💬', text: 'Respond within 1 hour to increase buyer trust.' },
                                        { icon: '🤝', text: 'Meet at school gates for the safest transactions.' }
                                    ].map((tip, i) => (
                                        <div key={i} style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1rem', alignItems: 'flex-start' }}>
                                            <span style={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>{tip.icon}</span>
                                            <p style={{ margin: 0, fontSize: isMobile ? '0.85rem' : '0.9rem', color: '#64748b', fontWeight: 600, lineHeight: 1.5 }}>{tip.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
