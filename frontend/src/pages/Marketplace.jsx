import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import ProductGrid from '../components/marketplace/ProductGrid';
import { api } from '../lib/api';

const Marketplace = () => {
    const { activeCategory, setActiveCategory } = useApp();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: activeCategory || 'all',
        minPrice: '',
        maxPrice: '',
        search: '',
        location: [],
        condition: []
    });

    // Synchronize local filter with context category if it changes
    useEffect(() => {
        if (activeCategory) {
            setFilters(prev => ({ ...prev, category: activeCategory }));
        }
    }, [activeCategory]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await api.getProducts();
                if (data) {
                    setProducts(data);
                    setFilteredProducts(data);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (filters.category !== 'all') {
            result = result.filter(p => p.category === filters.category);
        }

        if (filters.minPrice) {
            result = result.filter(p => p.price >= parseInt(filters.minPrice));
        }

        if (filters.maxPrice) {
            result = result.filter(p => p.price <= parseInt(filters.maxPrice));
        }

        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term)
            );
        }

        if (filters.location.length > 0) {
            result = result.filter(p => filters.location.includes(p.location));
        }

        if (filters.condition.length > 0) {
            result = result.filter(p => filters.condition.includes(p.condition));
        }

        setFilteredProducts(result);
    }, [filters, products]);

    // Extract unique categories and locations for dynamic filters
    const availableCategories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
    const availableLocations = [...new Set(products.map(p => p.location).filter(Boolean))];

    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        setCurrentPageIndex(1); // Reset to page 1 when filters change
    }, [filters]);

    // Pagination logic
    const indexOfLastProduct = currentPageIndex * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem', gap: '2rem' }}>
                <h2 style={{ fontSize: '2rem', color: 'var(--jiji-green)', margin: 0 }}>Marketplace</h2>
                <div style={{ flex: 1, maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder="Search for items..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #eee', borderRadius: '12px', background: '#f8f9fa' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    availableCategories={availableCategories}
                    availableLocations={availableLocations}
                />
                <main>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading products...</div>
                    ) : (
                        <>
                            <ProductGrid products={currentProducts} />

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', alignItems: 'center' }}>
                                    <button
                                        disabled={currentPageIndex === 1}
                                        onClick={() => setCurrentPageIndex(prev => prev - 1)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', opacity: currentPageIndex === 1 ? 0.5 : 1 }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ fontWeight: 600 }}>Page {currentPageIndex} of {totalPages}</span>
                                    <button
                                        disabled={currentPageIndex === totalPages}
                                        onClick={() => setCurrentPageIndex(prev => prev + 1)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1rem', opacity: currentPageIndex === totalPages ? 0.5 : 1 }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Marketplace;
