import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import ProductGrid from '../components/marketplace/ProductGrid';
import { api } from '../lib/api';

const Accommodation = () => {
    const { activeCategory, setActiveCategory } = useApp();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'housing',
        minPrice: '',
        maxPrice: '',
        search: '',
        location: [],
        condition: [],
        verifiedOnly: false
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await api.getProducts();
                if (data) {
                    // Filter for housing category only
                    const housingItems = data.filter(p => p.category === 'housing');
                    setProducts(housingItems);
                    setFilteredProducts(housingItems);
                }
            } catch (error) {
                console.error("Error fetching accommodation:", error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

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

        if (filters.verifiedOnly) {
            result = result.filter(p => p.is_verified);
        }

        setFilteredProducts(result);
    }, [filters, products]);

    const availableLocations = [...new Set(products.map(p => p.location).filter(Boolean))];

    const [currentPageIndex, setCurrentPageIndex] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        setCurrentPageIndex(1);
    }, [filters]);

    const indexOfLastProduct = currentPageIndex * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--campus-blue)', margin: 0 }}>Student <span style={{ color: 'var(--jiji-green)' }}>Accommodation</span></h2>
                <div style={{ flex: 1, minWidth: '300px', maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder="Search for hostels, rentals..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        style={{ width: '100%', padding: '0.85rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '14px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 900 ? '1fr' : '280px 1fr', gap: '2.5rem' }}>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    availableCategories={['housing']}
                    availableLocations={availableLocations}
                    hideCategory={true}
                />
                <main>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '4rem' }}>
                            <div className="spinner"></div>
                            <p style={{ marginTop: '1rem', color: '#64748b' }}>Finding the best housing deals...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '1rem' }}>No accommodation found matching your criteria</h3>
                            <button onClick={() => setFilters({ ...filters, search: '', minPrice: '', maxPrice: '', location: [] })} className="btn btn-secondary">Clear all filters</button>
                        </div>
                    ) : (
                        <>
                            <ProductGrid products={currentProducts} />

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem', alignItems: 'center' }}>
                                    <button
                                        disabled={currentPageIndex === 1}
                                        onClick={() => setCurrentPageIndex(prev => prev - 1)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1.25rem', opacity: currentPageIndex === 1 ? 0.5 : 1 }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ fontWeight: 700, color: '#475569' }}>{currentPageIndex} / {totalPages}</span>
                                    <button
                                        disabled={currentPageIndex === totalPages}
                                        onClick={() => setCurrentPageIndex(prev => prev + 1)}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 1.25rem', opacity: currentPageIndex === totalPages ? 0.5 : 1 }}
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

export default Accommodation;
