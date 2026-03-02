import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { useApp } from '../../AppContext';
<<<<<<< HEAD
=======
import { useMediaQuery } from '../../hooks/useMediaQuery';
>>>>>>> teammate/main

const ProductCard = ({ product, onClick }) => {
    const { user, wishlist, toggleWishlist, setIsAuthModalOpen } = useApp();
    const isWishlisted = wishlist.some(p => p.id === product.id);
<<<<<<< HEAD
=======
    const isMobile = useMediaQuery('(max-width: 768px)');
>>>>>>> teammate/main

    const handleAction = (e, callback) => {
        e.stopPropagation();
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            callback();
        }
    };

<<<<<<< HEAD
    // Removed verification tiers — all users are equal

=======
>>>>>>> teammate/main
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
<<<<<<< HEAD
                        top: '0.75rem',
                        right: '0.75rem',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
=======
                        top: isMobile ? '0.5rem' : '0.75rem',
                        right: isMobile ? '0.5rem' : '0.75rem',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: isMobile ? '28px' : '32px',
                        height: isMobile ? '28px' : '32px',
>>>>>>> teammate/main
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
<<<<<<< HEAD
                    <Heart size={18} color={isWishlisted ? 'var(--jiji-orange)' : '#ccc'} fill={isWishlisted ? 'var(--jiji-orange)' : 'none'} />
=======
                    <Heart size={isMobile ? 16 : 18} color={isWishlisted ? 'var(--jiji-orange)' : '#ccc'} fill={isWishlisted ? 'var(--jiji-orange)' : 'none'} />
>>>>>>> teammate/main
                </button>
            </div>
            <div className="product-info">
                <div>
<<<<<<< HEAD
                    <h3 className="product-title" style={{ fontSize: '0.9rem', marginBottom: '0.2rem', lineHeight: '1.2' }}>{product.title}</h3>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--jiji-green)' }}>
=======
                    <h3 className="product-title" style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', marginBottom: '0.2rem', lineHeight: '1.3', minHeight: isMobile ? '2.2rem' : '2.4rem' }}>{product.title}</h3>
                    <div style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 800, color: 'var(--jiji-green)' }}>
>>>>>>> teammate/main
                        KSh {Number(product.price || 0).toLocaleString()}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #f5f5f5', paddingTop: '0.4rem' }}>
<<<<<<< HEAD
                    <img src={product.seller_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller_name || 'Seller')}&background=random`} style={{ borderRadius: '50%', width: '24px', height: '24px', objectFit: 'cover' }} alt="Seller" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                        {product.seller_name || 'Seller'}
                    </span>
                    {/* Removed Verified Badge */}
                </div>
            </div>


=======
                    <img src={product.seller_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.seller_name || 'Seller')}&background=random`} style={{ borderRadius: '50%', width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', objectFit: 'cover', flexShrink: 0 }} alt="Seller" />
                    <span style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 500, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                        {product.seller_name || 'Seller'}
                    </span>
                </div>
            </div>
>>>>>>> teammate/main
        </div>
    );
};

export default ProductCard;
