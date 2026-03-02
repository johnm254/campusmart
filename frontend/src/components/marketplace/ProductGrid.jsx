import React, { useState } from 'react';
import ProductCard from './ProductCard';
import ProductDetailModal from '../modals/ProductDetailModal';

const ProductGrid = ({ products }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                No products found matching your filters.
            </div>
        );
    }

    return (
        <>
            <div className="product-grid">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
                ))}
            </div>
            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
};

export default ProductGrid;
