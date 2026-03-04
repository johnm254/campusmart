import React from 'react';
import { useApp } from '../AppContext';
import ProductCard from '../components/marketplace/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Wishlist = () => {
    const { wishlist, setCurrentPage } = useApp();
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="container" style={{ padding: isMobile ? '1rem' : '2rem 0' }}>
            <div style={{ marginBottom: isMobile ? '1.5rem' : '2rem' }}>
                <h2 style={{ 
                    fontSize: isMobile ? '1.75rem' : '2.5rem', 
                    color: 'var(--campus-blue)', 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <Heart size={isMobile ? 28 : 36} color="var(--jiji-orange)" fill="var(--jiji-orange)" />
                    My Wishlist
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
                </p>
            </div>
            
            {wishlist.length === 0 ? (
                <div style={{ 
                    textAlign: 'center', 
                    padding: isMobile ? '3rem 1rem' : '4rem 2rem',
                    background: 'white',
                    borderRadius: isMobile ? '20px' : '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <Heart size={isMobile ? 64 : 80} color="var(--jiji-orange)" style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
                    <h3 style={{ 
                        fontSize: isMobile ? '1.25rem' : '1.5rem', 
                        fontWeight: 800, 
                        color: '#111827', 
                        marginBottom: '0.75rem' 
                    }}>
                        Your wishlist is empty
                    </h3>
                    <p style={{ 
                        color: 'var(--text-secondary)', 
                        marginBottom: isMobile ? '1.5rem' : '2rem',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                    }}>
                        Start adding items you love to keep track of them!
                    </p>
                    <button 
                        className="btn btn-primary" 
                        style={{ 
                            marginTop: '1rem',
                            padding: isMobile ? '0.85rem 1.5rem' : '1rem 2rem',
                            fontSize: isMobile ? '0.95rem' : '1rem',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }} 
                        onClick={() => setCurrentPage('marketplace')}
                    >
                        <ShoppingBag size={isMobile ? 18 : 20} />
                        Explore Marketplace
                    </button>
                </div>
            ) : (
                <div className="product-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: isMobile ? '1rem' : '1.5rem'
                }}>
                    {wishlist.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
