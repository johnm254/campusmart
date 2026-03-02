import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { useApp } from '../../AppContext';

const ProductCard = ({ product, onClick }) => {
    const { user, wishlist, toggleWishlist, setIsAuthModalOpen } = useApp();
    const isWishlisted = wishlist.some(p => p.id === product.id);

    const handleAction = (e, callback) => {
        e.stopPropagation();
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            callback();
        }
    };

    // Removed verification tiers — all users are equal

    return (
        <div
            className="product-card"
            onClick={() => onClick?.()}
        >
            <div className="product-image-container">
                <img
                    src={product.image_url || 'https://via.placeholder.com/300x240'}
                    className="product-image"
                    alt={product.title}
                />
                <button
                    onClick={(e) => handleAction(e, () => toggleWishlist(product))}
                    style={{
                        position: 'absolute',
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <Heart size={18} color={isWishlisted ? 'var(--jiji-orange)' : '#ccc'} fill={isWishlisted ? 'var(--jiji-orange)' : 'none'} />
                </button>
            </div>
            <div className="product-info">
                <div>
                    <h3 className="product-title" style={{ fontSize: '0.9rem', marginBottom: '0.2rem', lineHeight: '1.2' }}>{product.title}</h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jiji-green)' }}>
                        KSh {Number(product.price || 0).toLocaleString()}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #f5f5f5', paddingTop: '0.4rem' }}>
                    <img src={product.seller_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller_name || 'Seller')}&background=random`} style={{ borderRadius: '50%', width: '24px', height: '24px', objectFit: 'cover' }} alt="Seller" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                        {product.seller_name || 'Seller'}
                    </span>
                    {/* Removed Verified Badge */}
                </div>
            </div>


        </div>
    );
};

export default ProductCard;
