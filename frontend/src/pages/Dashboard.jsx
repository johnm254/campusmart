import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import { Package, Eye, Heart, MessageCircle, ArrowUpRight, Clock, Plus, Check, Star } from 'lucide-react';

const Dashboard = () => {
    const { user, wishlist, setCurrentPage, setIsSellModalOpen, addNotification, setIsPremiumModalOpen } = useApp();
    const [myProducts, setMyProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [realStats, setRealStats] = useState({
        active_listings: 0,
        total_views: 0,
        saved_items: 0,
        total_messages: 0,
        average_rating: 0,
        review_count: 0
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

    const stats = [
        { label: 'Active Listings', value: (realStats?.active_listings || 0).toString(), icon: Package, color: 'var(--jiji-green)' },
        { label: 'Total Views', value: (realStats?.total_views || 0).toString(), icon: Eye, color: 'var(--jkuat-blue)' },
        { label: 'Saved Items', value: (realStats?.saved_items || 0).toString(), icon: Heart, color: 'var(--jiji-orange)' },
        { label: 'Avg Rating', value: (realStats?.average_rating || 0).toFixed(1) + ' (' + (realStats?.review_count || 0) + ')', icon: Star, color: '#FFD700' },
    ];

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', color: 'var(--campus-blue)', marginBottom: '0.5rem' }}>Welcome back, {user?.full_name || user?.name || 'Comrade'}!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your campus listings and student interactions.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setCurrentPage('messages')}
                        className="btn btn-secondary"
                        style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#eef2ff', border: '1px solid #d0dfff', color: 'var(--campus-blue)' }}
                    >
                        <MessageCircle size={20} /> My Chats ({realStats.total_messages})
                    </button>
                    <button
                        onClick={() => setIsSellModalOpen(true)}
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                    >
                        <Plus size={20} /> Create New Listing
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', background: stat.color, opacity: 0.05, borderRadius: '50%' }}></div>
                        <div style={{ background: stat.color + '15', color: stat.color, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <stat.icon size={24} />
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>My Listings</h3>
                            <button
                                onClick={() => setCurrentPage('marketplace')}
                                style={{ background: 'none', border: 'none', color: 'var(--jiji-green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                Explore Marketplace <ArrowUpRight size={16} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading your items...</div>
                            ) : myProducts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '16px', border: '2px dashed #eee' }}>
                                    <Package size={48} color="#ccc" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#888', marginBottom: '1.5rem' }}>You haven't listed any items for sale yet.</p>
                                    <button onClick={() => setIsSellModalOpen(true)} className="btn btn-secondary" style={{ borderRadius: '8px' }}>Start Selling</button>
                                </div>
                            ) : (
                                myProducts.slice(0, 5).map((product, i) => (
                                    <div key={product.id} style={{ display: 'flex', gap: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < myProducts.length - 1 && i < 4 ? '1px solid #f0f0f0' : 'none', alignItems: 'center' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={product.image_url || 'https://via.placeholder.com/80x80'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.title} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem', color: '#1a1a1a' }}>{product.title}</div>
                                            <div style={{ color: 'var(--jiji-green)', fontWeight: 900, fontSize: '1.05rem' }}>KSh {Number(product.price).toLocaleString()}</div>
                                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>
                                                <span>{product.category}</span>
                                                <span>•</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={14} /> {product.views} views</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                            <div style={{ background: '#e6f4ea', color: '#1e7e34', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textAlign: 'center' }}>Active</div>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{ background: '#fff0f0', color: '#d32f2f', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(211, 47, 47, 0.1)' }}
                                                onMouseOver={e => e.currentTarget.style.background = '#ffe5e5'}
                                                onMouseOut={e => e.currentTarget.style.background = '#fff0f0'}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recently Received Reviews */}
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Feedback/Reviews</h3>
                            <div style={{ background: '#fff9e6', color: '#b8860b', padding: '0.4rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star size={16} fill="#b8860b" /> {(realStats?.average_rating || 0).toFixed(1)} / 5.0
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading reviews...</div>
                            ) : reviews.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem', background: '#fcfcfc', borderRadius: '16px', border: '2px dashed #eee' }}>
                                    <Star size={48} color="#eee" style={{ marginBottom: '1rem' }} />
                                    <p style={{ color: '#888', fontWeight: 600 }}>No reviews yet. Transactions build trust!</p>
                                </div>
                            ) : (
                                reviews.slice(0, 3).map((review) => (
                                    <div key={review.id} style={{ display: 'flex', gap: '1.25rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                        <img
                                            src={review.reviewer_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=random`}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                            alt={review.reviewer_name}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{review.reviewer_name}</span>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} size={12} fill={review.rating >= s ? "#FFD700" : "none"} color={review.rating >= s ? "#FFD700" : "#cbd5e0"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.88rem', color: '#4a5568', lineHeight: 1.5 }}>
                                                "{review.comment || 'No comment provided.'}"
                                            </p>
                                            <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>
                                                {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: 'var(--campus-blue)', color: 'white', padding: '2.5rem 2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(29, 61, 110, 0.2)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            {user?.is_verified ? <Check size={32} color="white" /> : <Package size={32} color="white" />}
                        </div>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
                            {user?.is_verified ? 'You are Verified!' : 'Sell 15x Faster!'}
                        </h3>
                        <p style={{ opacity: 0.8, fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.6 }}>
                            {user?.is_verified
                                ? 'Your listings are currently boosted. Enjoy the extra visibility!'
                                : 'Verified listings get 15x more views from fellow students.'
                            }
                        </p>
                        {!user?.is_verified && (
                            <button
                                onClick={() => setIsPremiumModalOpen(true)}
                                className="btn btn-secondary"
                                style={{ width: '100%', borderRadius: '12px', padding: '1rem', fontWeight: 700 }}
                            >
                                Get Verified
                            </button>
                        )}
                    </div>

                    <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Quick Tips</h3>
                        <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div style={{ color: 'var(--jiji-green)', flexShrink: 0 }}>•</div>
                                <span>Use clear, well-lit photos for 2x more clicks.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div style={{ color: 'var(--jiji-green)', flexShrink: 0 }}>•</div>
                                <span>Be honest about any flaws to build trust.</span>
                            </li>
                            <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <div style={{ color: 'var(--jiji-green)', flexShrink: 0 }}>•</div>
                                <span>Respond to messages within 2 hours.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
