import React, { useState } from 'react';
import { X, MapPin, Shield, ShieldCheck, MessageCircle, Phone, Share2, Info, Camera, Flag, Tag, Heart, Send, Star } from 'lucide-react';
import { useApp } from '../../AppContext';
import { api } from '../../lib/api';
import UserReviewModal from './UserReviewModal';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const ProductDetailModal = ({ product, onClose }) => {
    const { user, addNotification, wishlist, toggleWishlist, setIsAuthModalOpen } = useApp();
    const [showContact, setShowContact] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessage, setChatMessage] = useState('');
    const [viewRecorded, setViewRecorded] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [sellerRating, setSellerRating] = useState({ average_rating: 0, review_count: 0 });
    const [sellerReviews, setSellerReviews] = useState([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [reviewTarget, setReviewTarget] = useState({ id: product.seller_id, name: product.seller_name, parentId: null });
    const isMobile = useMediaQuery('(max-width: 768px)');

    const productImages = (() => {
        try {
            return product.images ? JSON.parse(product.images) : [product.image_url];
        } catch (e) {
            return [product.image_url];
        }
    })();

    const fetchSellerData = async () => {
        try {
            const [ratingRes, reviewsRes] = await Promise.all([
                api.getUserRating(product.seller_id),
                api.getUserReviews(product.seller_id)
            ]);

            if (ratingRes && ratingRes.average_rating !== undefined) {
                setSellerRating(ratingRes);
            }
            if (Array.isArray(reviewsRes)) {
                console.log('Received reviews for seller:', reviewsRes);
                setSellerReviews(reviewsRes);
            }
        } catch (err) {
            console.error('Error fetching seller reviews:', err);
        }
    };

    React.useEffect(() => {
        if (product && !viewRecorded) {
            api.recordProductView(product.id).catch(err => console.error('Error recording view:', err));
            setViewRecorded(true);
        }

        if (product?.seller_id) {
            fetchSellerData();
        }
    }, [product, viewRecorded]);

    if (!product) return null;

    const isWishlisted = wishlist.some(p => p.id === product.id);

    const handleActionCheck = (callback) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        callback();
    };

    const handleSendMessage = async () => {
        if (!chatMessage.trim()) return;

        if (!product.seller_id) {
            addNotification('Error', 'Cannot send message: seller information is missing.', 'error');
            return;
        }

        if (user && product.seller_id === user.id) {
            addNotification('Oops!', "You can't send a message to yourself.", 'warning');
            return;
        }

        const content = chatMessage.trim();
        setChatMessage('');
        try {
            const result = await api.sendMessage(product.seller_id, content, product.id);
            if (result && result.id) {
                addNotification('Message Sent!', `Your message was delivered to ${product.seller_name || 'the seller'}.`, 'success');
                setShowChat(false);
            } else {
                const errMsg = result?.message || 'Failed to send message. Please try again.';
                addNotification('Error', errMsg, 'error');
                setChatMessage(content);
            }
        } catch (err) {
            console.error('Send message error:', err);
            addNotification('Error', 'Network error. Is the server running?', 'error');
            setChatMessage(content);
        }
    };

    const handleMarkUnavailable = () => {
        handleActionCheck(() => {
            const confirmAction = window.confirm("Are you sure you want to mark this item as unavailable?");
            if (confirmAction) {
                addNotification('Item Updated', 'Product has been marked as unavailable.', 'success');
                onClose();
            }
        });
    };


    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', overflowY: 'auto', padding: isMobile ? '0' : '2rem 0' }}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    maxWidth: isMobile ? '100%' : '1200px',
                    width: isMobile ? '100%' : '95%',
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: isMobile ? '100vh' : '95vh',
                    height: isMobile ? '100vh' : 'auto',
                    borderRadius: isMobile ? '0' : '12px',
                    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5)',
                    background: '#f4f4f4'
                }}
            >
                <div style={{ padding: isMobile ? '0.75rem 1rem' : '0.75rem 1.5rem', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', position: 'sticky', top: 0, zIndex: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: isMobile ? '1.1rem' : '1.5rem', letterSpacing: '-1px' }}>
                            <span style={{ color: '#1d3d6e' }}>Campus</span>
                            <span style={{ color: 'var(--jiji-green)' }}>Mart</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1.5rem' }}>
                        {user && !isMobile && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                    src={user.avatar_url || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.name || 'U')}&background=28a745&color=fff`}
                                    alt="Profile"
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--jiji-green)' }}
                                />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>{user.full_name || user.name}</span>
                            </div>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}><X size={isMobile ? 20 : 24} color="#333" /></button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 350px', gap: isMobile ? '1rem' : '1.5rem' }} className="product-detail-grid">

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ background: 'white', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ position: 'relative', width: '100%', height: isMobile ? '300px' : '500px', background: '#f0f0f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <img
                                        src={productImages[selectedImgIndex] || 'https://via.placeholder.com/800x600'}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                        alt={product.title}
                                    />
                                    <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Camera size={14} /> {selectedImgIndex + 1}/{productImages.length}
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                                    >
                                        <Heart size={20} color={isWishlisted ? 'var(--jiji-orange)' : '#ccc'} fill={isWishlisted ? 'var(--jiji-orange)' : 'none'} />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    {productImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImgIndex(idx)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                border: selectedImgIndex === idx ? '2px solid var(--jiji-green)' : '1px solid #eee',
                                                borderRadius: '4px',
                                                overflow: 'hidden',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: selectedImgIndex === idx ? 1 : 0.6 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ background: 'white', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.75rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1a1a1a' }}>{product.title}</h1>
                                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem', color: '#666', fontSize: isMobile ? '0.8rem' : '0.9rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={16} color="#888" /> {product.location || 'On Campus'}</span>
                                    <span>ΓÇó</span>
                                    <span>{new Date(product.created_at || Date.now()).toLocaleDateString()}</span>
                                    <span>ΓÇó</span>
                                    <span style={{
                                        color: 'var(--jiji-green)',
                                        fontWeight: 700,
                                        background: 'rgba(61, 184, 58, 0.1)',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {product.category === 'housing' ? `${product.condition}` : product.condition || 'Used'}
                                    </span>
                                </div>
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', marginBottom: '0.75rem', color: '#333', fontWeight: 800 }}>
                                        {product.category === 'housing' ? 'House Details & Amenities' : 'Description'}
                                    </h3>

                                    {product.category?.toLowerCase() === 'housing' && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            {/* Landmark Section */}
                                            {(() => {
                                                try {
                                                    const meta = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;
                                                    if (!meta?.landmarks) return null;
                                                    return (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                                                            <MapPin size={12} color="var(--jiji-orange)" /> {meta.landmarks}
                                                        </div>
                                                    );
                                                } catch (e) { return null; }
                                            })()}

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                {(() => {
                                                    try {
                                                        const meta = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;
                                                        return (
                                                            <>
                                                                <div>
                                                                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Rooms</div>
                                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--campus-blue)' }}>{meta?.room_count || '1'}</div>
                                                                </div>
                                                                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                                                                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Facility</div>
                                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--jiji-green)', textTransform: 'capitalize' }}>{meta?.facility_type || 'Private'}</div>
                                                                </div>
                                                                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '0.75rem' }}>
                                                                    <div style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Distance</div>
                                                                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--jiji-orange)' }}>{meta?.distance || 'Nearby'}</div>
                                                                </div>
                                                            </>
                                                        );
                                                    } catch (e) { return null; }
                                                })()}
                                            </div>

                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                                {(() => {
                                                    try {
                                                        const meta = typeof product.metadata === 'string' ? JSON.parse(product.metadata) : product.metadata;
                                                        const amenities = meta?.amenities || [];
                                                        if (amenities.length === 0) return null;
                                                        return amenities.map(amenity => (
                                                            <span
                                                                key={amenity}
                                                                style={{
                                                                    background: 'rgba(61, 184, 58, 0.1)',
                                                                    color: '#3db83a',
                                                                    padding: '0.35rem 0.75rem',
                                                                    borderRadius: '20px',
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 700,
                                                                    border: '1px solid rgba(61, 184, 58, 0.2)'
                                                                }}
                                                            >
                                                                {amenity}
                                                            </span>
                                                        ));
                                                    } catch (e) { return null; }
                                                })()}
                                            </div>

                                            {product.security_features && (
                                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
                                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--campus-blue)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <ShieldCheck size={16} /> Security & Safety
                                                    </h4>
                                                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{product.security_features}</p>
                                                </div>
                                            )}

                                            {product.contact_phone && (
                                                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '12px', border: '1px solid #dcfce7', marginBottom: '1.25rem' }}>
                                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#166534', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Phone size={16} /> Property Contact
                                                    </h4>
                                                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#15803d', margin: 0 }}>{product.contact_phone}</p>
                                                </div>
                                            )}

                                            {(() => {
                                                const lat = parseFloat(product.latitude);
                                                const lng = parseFloat(product.longitude);
                                                const hasCoords = !isNaN(lat) && !isNaN(lng) && product.latitude !== null;

                                                if (hasCoords) {
                                                    return (
                                                        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #e0f2fe', marginBottom: '1.25rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--campus-blue)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                                        <MapPin size={16} /> Live Map Location
                                                                    </h4>
                                                                    <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: 0 }}>Pinpointed by Landlord</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                                                                    }}
                                                                    style={{
                                                                        background: 'var(--campus-blue)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '8px',
                                                                        fontWeight: 800,
                                                                        fontSize: '0.75rem',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.4rem'
                                                                    }}
                                                                >
                                                                    VIEW LIVE MAP
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>
                                                            <Info size={14} /> Location PIN not shared for this property.
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    )}

                                    <p style={{ color: '#444', lineHeight: 1.6, whiteSpace: 'pre-line', fontSize: isMobile ? '0.9rem' : '1rem' }}>{product.description || 'No description provided.'}</p>
                                </div>

                                {/* Reviews Section */}
                                <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 800, margin: 0 }}>Reviews for {product.seller_name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Star size={16} fill="#FFD700" color="#FFD700" />
                                            <span style={{ fontWeight: 800 }}>{(sellerRating?.average_rating || 0).toFixed(1)}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#888' }}>({sellerRating?.review_count || 0})</span>
                                        </div>
                                    </div>

                                    {sellerReviews.length === 0 ? (
                                        <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#888', fontSize: '0.9rem' }}>
                                            No reviews yet for this seller.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {sellerReviews.filter(r => !r.parent_id).slice(0, showAllReviews ? undefined : 5).map((review) => {
                                                const replies = sellerReviews.filter(reply => reply.parent_id === review.id);
                                                return (
                                                    <div key={review.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eee', overflow: 'hidden' }}>
                                                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer_name)}&background=random`} style={{ width: '100%', height: '100%' }} />
                                                                    </div>
                                                                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{review.reviewer_name}</span>
                                                                </div>
                                                                <div style={{ display: 'flex', gap: '1px' }}>
                                                                    {[1, 2, 3, 4, 5].map(s => (
                                                                        <Star key={s} size={10} fill={review.rating >= s ? "#FFD700" : "none"} color={review.rating >= s ? "#FFD700" : "#cbd5e0"} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#444', lineHeight: 1.4 }}>{review.comment}</p>

                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                                                <div style={{ fontSize: '0.7rem', color: '#999' }}>
                                                                    {new Date(review.created_at).toLocaleDateString()}
                                                                </div>
                                                                {user && review.reviewer_id !== user.id && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setReviewTarget({
                                                                                id: review.reviewer_id,
                                                                                name: review.reviewer_name,
                                                                                parentId: review.id
                                                                            });
                                                                            setShowReviewModal(true);
                                                                        }}
                                                                        style={{
                                                                            background: 'none',
                                                                            border: 'none',
                                                                            color: 'var(--jiji-green)',
                                                                            fontSize: '0.75rem',
                                                                            fontWeight: 800,
                                                                            cursor: 'pointer',
                                                                            padding: '0.2rem 0.5rem',
                                                                            borderRadius: '4px',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '4px'
                                                                        }}
                                                                        onMouseOver={e => e.currentTarget.style.background = 'var(--jiji-light-blue)'}
                                                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                                                    >
                                                                        <MessageCircle size={12} /> Comment/Reply
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Replies Container */}
                                                        {replies.length > 0 && (
                                                            <div style={{ paddingLeft: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '2px solid #edf2f7', marginLeft: '0.75rem' }}>
                                                                {replies.map(reply => (
                                                                    <div key={reply.id} style={{ background: '#fcfcfd', padding: '0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reply.reviewer_name)}&background=random`} style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                                                                            <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1d3d6e' }}>{reply.reviewer_name}</span>
                                                                            <div style={{ display: 'flex', gap: '1px', marginLeft: 'auto' }}>
                                                                                {[1, 2, 3, 4, 5].map(s => (
                                                                                    <Star key={s} size={8} fill={reply.rating >= s ? "#FFD700" : "none"} color={reply.rating >= s ? "#FFD700" : "#cbd5e0"} />
                                                                                ))}
                                                                            </div>
                                                                            <span style={{ fontSize: '0.65rem', color: '#999' }}>{new Date(reply.created_at).toLocaleDateString()}</span>
                                                                        </div>
                                                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#555', lineHeight: 1.3 }}>{reply.comment}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                            {sellerReviews.filter(r => !r.parent_id).length > 5 && (
                                                <button
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                    style={{ background: 'none', border: 'none', color: '#1d3d6e', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0' }}
                                                >
                                                    {showAllReviews ? 'Show less' : `Show all ${sellerReviews.filter(r => !r.parent_id).length} reviews`}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ background: 'white', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <img
                                        src={product.seller_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller_name || 'Seller')}&background=random`}
                                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                                        alt="Seller"
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            {product.seller_name || 'Comrade Seller'}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={12}
                                                        fill={(sellerRating?.average_rating || 0) >= star ? "#FFD700" : "none"}
                                                        color={(sellerRating?.average_rating || 0) >= star ? "#FFD700" : "#cbd5e0"}
                                                    />
                                                ))}
                                                <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 700 }}>({sellerRating?.review_count || 0})</span>
                                            </div>
                                            <span style={{ fontSize: '0.65rem', color: product.seller_last_seen && (Math.abs(new Date() - new Date(product.seller_last_seen)) < 300000) ? 'var(--jiji-green)' : '#999', fontWeight: 600 }}>
                                                {product.seller_last_seen && (Math.abs(new Date() - new Date(product.seller_last_seen)) < 300000) ? 'Active now' : 'Inactive'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleActionCheck(() => setShowReviewModal(true))}
                                            style={{
                                                marginTop: '0.5rem',
                                                background: 'none',
                                                border: 'none',
                                                color: '#1d3d6e',
                                                fontSize: '0.75rem',
                                                fontWeight: 800,
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                padding: 0
                                            }}
                                        >
                                            Rate this Seller
                                        </button>
                                    </div>
                                </div>

                                {!showChat ? (
                                    <>
                                        <button
                                            onClick={() => handleActionCheck(() => setShowContact(!showContact))}
                                            style={{ width: '100%', background: showContact ? '#f8f9fa' : '#3db83a', color: showContact ? '#333' : 'white', border: showContact ? '1px solid #ddd' : 'none', height: '52px', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                        >
                                            <Phone size={22} /> {showContact ? product.whatsapp || '07XXXXXXXX' : 'Show contact'}
                                        </button>

                                        <button
                                            onClick={() => handleActionCheck(() => setShowChat(true))}
                                            style={{ width: '100%', background: 'white', color: '#3db83a', border: '2px solid #3db83a', height: '52px', borderRadius: '4px', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer' }}
                                        >
                                            <MessageCircle size={22} /> Start chat
                                        </button>
                                    </>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', background: '#fdfdfd' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>Chat with {product.seller_name}</span>
                                            <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={16} /></button>
                                        </div>
                                        <textarea
                                            placeholder="Type your message..."
                                            value={chatMessage}
                                            onChange={(e) => setChatMessage(e.target.value)}
                                            style={{ width: '100%', height: '80px', border: '1px solid #ddd', borderRadius: '4px', padding: '0.5rem', fontSize: '0.9rem', outline: 'none', resize: 'none' }}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!chatMessage.trim()}
                                            style={{ background: '#3db83a', color: 'white', border: 'none', height: '40px', borderRadius: '4px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: chatMessage.trim() ? 'pointer' : 'not-allowed', opacity: chatMessage.trim() ? 1 : 0.6 }}
                                        >
                                            <Send size={16} /> Send Message
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ background: 'white', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                                <div style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, color: 'var(--jiji-green)', letterSpacing: '-0.5px' }}>
                                    KSh {Number(product.price || 0).toLocaleString()}
                                </div>

                                {product.category === 'housing' && product.latitude && product.longitude && (
                                    <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--jiji-green)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                                            <ShieldCheck size={14} /> LIVE LOCATION VERIFIED
                                        </div>
                                        <button
                                            onClick={() => window.open(`https://www.google.com/maps?q=${product.latitude},${product.longitude}`, '_blank')}
                                            style={{
                                                width: '100%',
                                                background: '#4285F4',
                                                color: 'white',
                                                border: 'none',
                                                height: '42px',
                                                borderRadius: '4px',
                                                fontWeight: 800,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)'
                                            }}
                                        >
                                            <MapPin size={18} /> VIEW LIVE MAP
                                        </button>
                                        <p style={{ fontSize: '0.65rem', color: '#888', marginTop: '0.5rem' }}>
                                            Coordinates: {parseFloat(product.latitude).toFixed(4)}, {parseFloat(product.longitude).toFixed(4)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <button
                                    onClick={handleMarkUnavailable}
                                    style={{ background: 'white', color: '#1d3d6e', border: '2px solid #1d3d6e', height: '42px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#f0f4f8'}
                                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                                >
                                    Mark unavailable
                                </button>
                                <button
                                    onClick={() => handleActionCheck(() => {
                                        setReviewTarget({ id: product.seller_id, name: product.seller_name, parentId: null });
                                        setShowReviewModal(true);
                                    })}
                                    style={{ background: 'white', color: '#b8860b', border: '2px solid #b8860b', height: '42px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.background = '#fff9e6'}
                                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                                >
                                    <Star size={14} fill="#b8860b" /> Rate Seller
                                </button>
                            </div>

                            <div style={{ background: 'white', borderRadius: '8px', padding: isMobile ? '1rem' : '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ fontSize: isMobile ? '0.95rem' : '1rem', fontWeight: 800, textAlign: 'center', marginBottom: '1.25rem' }}>Safety tips</h3>
                                <ul style={{ fontSize: isMobile ? '0.8rem' : '0.875rem', color: '#333', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
                                    <li>Avoid sending any prepayments</li>
                                    <li>Meet with the seller at a safe public place</li>
                                    <li>Inspect what you're going to buy to make sure it's what you need</li>
                                    <li>Check all the docs and only pay if you're satisfied</li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <UserReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                revieweeId={reviewTarget.id}
                revieweeName={reviewTarget.name}
                parentId={reviewTarget.parentId}
                onReviewSubmitted={fetchSellerData}
            />
        </div>
    );
};

export default ProductDetailModal;
