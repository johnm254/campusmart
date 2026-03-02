import React from 'react';

<<<<<<< HEAD
const FilterSidebar = ({ filters, setFilters, availableCategories = [], availableLocations = [] }) => {
=======
const FilterSidebar = ({ filters, setFilters, availableCategories = [], availableLocations = [], isMobile = false, onClose }) => {
>>>>>>> teammate/main
    const categoryNames = {
        all: 'All items',
        books: 'Books & Stationaries',
        electronics: 'Gadgets & Electronics',
        furniture: 'Furniture',
        outfit: 'Outfit',
        utensils: 'Utensils',
        appliances: 'Home Appliances',
        housing: 'Accommodation',
<<<<<<< HEAD
        accessories: 'Accessories'
=======
        accessories: 'Accessories',
        other: 'Other'
>>>>>>> teammate/main
    };

    const toggleLocation = (loc) => {
        const newLocs = filters.location.includes(loc)
            ? filters.location.filter(l => l !== loc)
            : [...filters.location, loc];
        setFilters({ ...filters, location: newLocs });
    };

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

<<<<<<< HEAD
    return (
        <aside style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', height: 'fit-content', position: 'sticky', top: '100px' }}>
            <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--campus-blue)', margin: 0 }}>Filters</h2>
=======
    const handleReset = () => {
        setFilters({
            category: 'all',
            minPrice: '',
            maxPrice: '',
            search: '',
            location: [],
            condition: []
        });
        if (isMobile && onClose) onClose();
    };

    return (
        <aside style={{ background: 'white', padding: isMobile ? '0' : '1.5rem', borderRadius: isMobile ? '0' : '16px', boxShadow: isMobile ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.05)', height: 'fit-content', position: isMobile ? 'static' : 'sticky', top: '100px' }}>
            <div style={{ marginBottom: '2rem', paddingBottom: isMobile ? '0' : '1rem', borderBottom: isMobile ? 'none' : '1px solid #eee' }}>
                {!isMobile && <h2 style={{ fontSize: '1.25rem', color: 'var(--campus-blue)', margin: 0 }}>Filters</h2>}
>>>>>>> teammate/main
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--jiji-green)', marginBottom: '1rem' }}>Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {availableCategories.map(catId => (
                        <div
                            key={catId}
                            onClick={() => setFilters({ ...filters, category: catId })}
                            style={{
                                padding: '0.6rem 0.75rem',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                color: filters.category === catId ? 'var(--jiji-green)' : 'var(--text-secondary)',
                                fontWeight: filters.category === catId ? '600' : '400',
                                background: filters.category === catId ? 'var(--jiji-light-blue)' : 'transparent',
                                fontSize: '0.9rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {categoryNames[catId] || capitalize(catId)}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--jiji-green)', marginBottom: '1rem' }}>Price Range (KSh)</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem' }}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem', border: '1px solid #e0e0e0', borderRadius: '8px', fontSize: '0.85rem' }}
                    />
                </div>
            </div>

            {availableLocations.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--jiji-green)', marginBottom: '1rem' }}>Location</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {availableLocations.map(loc => (
                            <label key={loc} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <input
                                    type="checkbox"
                                    checked={filters.location.includes(loc)}
                                    onChange={() => toggleLocation(loc)}
                                    style={{ width: '18px', height: '18px', accentColor: 'var(--jiji-green)' }}
                                />
                                {loc}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Removed Verified Filter */}

            <button
                className="btn btn-secondary"
                style={{ width: '100%' }}
<<<<<<< HEAD
                onClick={() => setFilters({
                    category: 'all',
                    minPrice: '',
                    maxPrice: '',
                    search: '',
                    location: [],
                    condition: []
                })}
            >
                Reset Filters
            </button>
=======
                onClick={handleReset}
            >
                Reset Filters
            </button>

            {isMobile && (
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '0.75rem' }}
                    onClick={onClose}
                >
                    Apply Filters
                </button>
            )}
>>>>>>> teammate/main
        </aside>
    );
};

export default FilterSidebar;
