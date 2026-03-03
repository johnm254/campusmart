import React from 'react';
import { useApp } from '../../AppContext';

const categories = [
    { id: 'books', name: 'Books', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop' },
    { id: 'electronics', name: 'Electronics', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop' },
    { id: 'furniture', name: 'Furniture', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop' },
    { id: 'outfit', name: 'Outfit', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop' },
    { id: 'utensils', name: 'Utensils', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop' },
    { id: 'appliances', name: 'Home Appliances', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop' },
    { id: 'housing', name: 'Accommodation', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop' },
    { id: 'accessories', name: 'Accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=300&fit=crop' },
    { id: 'other', name: 'Other', image: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?w=400&h=300&fit=crop' }
];

const CategoryGrid = () => {
    const { navigateWithFilter } = useApp();

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {categories.map(cat => (
                <div
                    key={cat.id}
                    onClick={() => navigateWithFilter('marketplace', cat.id)}
                    style={{ background: 'white', overflow: 'hidden', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s' }}
                    className="category-card"
                >
                    <img src={cat.image} style={{ width: '100%', height: '120px', objectFit: 'cover' }} alt={cat.name} />
                    <div style={{ padding: '1rem', fontWeight: 600, color: 'var(--jiji-green)' }}>{cat.name}</div>
                </div>
            ))}
        </div>
    );
};

export default CategoryGrid;
