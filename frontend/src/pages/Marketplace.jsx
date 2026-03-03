import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../AppContext';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import ProductGrid from '../components/marketplace/ProductGrid';
import { api } from '../lib/api';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SlidersHorizontal, X, Search } from 'lucide-react';

const Marketplace = () => {
    const { activeCategory, setActiveCategory } = useApp();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
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
        <div className="container" style={{ paddingTop: isMobile ? '1.5rem' : '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: '5rem', minHeight: '100%' }}>
            {/* Header Section */}
            <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isMobile ? 'stretch' : 'flex-end',
                marginBottom: isMobile ? '1.5rem' : '2.5rem',
                gap: '1.5rem'
            }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.25rem', color: 'var(--blue)', margin: 0, fontWeight: 900 }}>Marketplace</h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem', fontWeight: 500 }}>Find the best student deals in your campus community</p>
                </div>

                <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '500px', display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search for books, electronics, etc..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            style={{
                                width: '100%',
                                padding: isMobile ? '0.75rem 1rem 0.75rem 2.75rem' : '0.85rem 1rem 0.85rem 3rem',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: '16px',
                                background: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                            }}
                            onFocus={e => { e.currentTarget.style.borderColor = 'var(--jiji-green)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)'; }}
                            onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'; }}
                        />
                    </div>
                    {isMobile && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            style={{
                                padding: '0 1rem',
                                background: showFilters ? 'var(--jiji-green)' : 'white',
                                color: showFilters ? 'white' : 'var(--jiji-green)',
                                border: '1.5px solid var(--jiji-green)',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 700
                            }}
                        >
                            {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '280px 1fr', gap: isMobile ? '1.5rem' : '3rem', flex: 1 }}>
                {/* Mobile Filter Modal */}
                {isMobile && showFilters && (
                    <>
                        <div onClick={() => setShowFilters(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(29, 61, 110, 0.4)', backdropFilter: 'blur(4px)', zIndex: 10000 }} />
                        <div style={{
                            position: 'fixed',
                            top: '10%',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'white',
                            zIndex: 10001,
                            overflowY: 'auto',
                            padding: '1.5rem',
                            borderRadius: '24px 24px 0 0',
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
                            animation: 'slideUp 0.3s ease-out'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--blue)', margin: 0, fontWeight: 800 }}>Filters</h2>
                                <button onClick={() => setShowFilters(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                    <X size={20} color="#64748b" />
                                </button>
                            </div>
                            <FilterSidebar
                                filters={filters}
                                setFilters={setFilters}
                                availableCategories={availableCategories}
                                availableLocations={availableLocations}
                                isMobile={true}
                                onClose={() => setShowFilters(false)}
                            />
                        </div>
                    </>
                )}

                {/* Desktop Filter Sidebar */}
                {!isMobile && (
                    <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <FilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            availableCategories={availableCategories}
                            availableLocations={availableLocations}
                        />
                    </div>
                )}

                <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '8rem 0', color: '#64748b', flex: 1 }}>
                            <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
                            <p style={{ fontWeight: 500 }}>Loading amazing deals...</p>
                        </div>
                    ) : (
                        <div className="fadeIn" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
                                    Showing <span style={{ color: 'var(--jiji-green)' }}>{filteredProducts.length}</span> items
                                </span>
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Grid View
                                </div>
                            </div>

                            <ProductGrid products={currentProducts} />

                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '4rem', paddingBottom: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <button
                                        disabled={currentPageIndex === 1}
                                        onClick={() => { setCurrentPageIndex(prev => prev - 1); window.scrollTo(0, 0); }}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.6rem 1.25rem', opacity: currentPageIndex === 1 ? 0.5 : 1, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setCurrentPageIndex(i + 1); window.scrollTo(0, 0); }}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: currentPageIndex === i + 1 ? 'var(--jiji-green)' : 'transparent',
                                                color: currentPageIndex === i + 1 ? 'white' : '#64748b',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                transition: '0.2s'
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPageIndex === totalPages}
                                        onClick={() => { setCurrentPageIndex(prev => prev + 1); window.scrollTo(0, 0); }}
                                        className="btn btn-secondary"
                                        style={{ padding: '0.6rem 1.25rem', opacity: currentPageIndex === totalPages ? 0.5 : 1, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Marketplace;
