import React from 'react';
import { useApp } from '../AppContext';
import ProductCard from '../components/marketplace/ProductCard';

const Wishlist = () => {
    const { wishlist, setCurrentPage } = useApp();

    return (
        <div className="container">
            <h2 style={{ marginBottom: '2rem' }}>My Wishlist</h2>
            {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}><Heart size={80} color="var(--jiji-orange)" /></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Your wishlist is currently empty.</p>
                    <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setCurrentPage('marketplace')}>
                        Explore Marketplace
                    </button>
                </div>
            ) : (
                <div className="product-grid">
                    {wishlist.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
