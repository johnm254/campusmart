import React from 'react';
import { useApp } from '../../AppContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Hero = () => {
    const { setCurrentPage } = useApp();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 900px)');

    return (
        <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: isMobile ? '1.5rem 1rem' : isTablet ? '2rem 1.5rem' : '3rem 2rem',
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr',
            gap: isTablet ? '1.5rem' : '4rem',
            alignItems: 'center'
        }}>
            {/* Hero image shown FIRST on mobile for visual impact */}
            {isTablet && (
                <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 45px rgba(0,0,0,0.1)', height: isMobile ? '200px' : '300px' }}>
                    <img src="/hero%20section.png" alt="Campus Trading" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}

            <div>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#e6f4ea',
                    color: 'var(--jiji-green)',
                    padding: isMobile ? '0.35rem 0.75rem' : '0.5rem 1rem',
                    borderRadius: '50px',
                    fontSize: isMobile ? '0.7rem' : '0.85rem',
                    fontWeight: 800,
                    marginBottom: isMobile ? '0.75rem' : '1.5rem',
                }}>
                    THE #1 STUDENT ECOSYSTEM
                </div>

                <h1 style={{
                    fontSize: isMobile ? '1.9rem' : isTablet ? '2.6rem' : '3.8rem',
                    lineHeight: 1.05,
                    marginBottom: isMobile ? '0.75rem' : '1.5rem',
                    color: 'var(--campus-blue)',
                    fontWeight: 900,
                    letterSpacing: isMobile ? '-0.5px' : '-1.5px'
                }}>
                    Quality Deals at{' '}
                    <span style={{ color: 'var(--jiji-green)' }}>Comrade Prices.</span>
                </h1>

                <p style={{
                    fontSize: isMobile ? '0.9rem' : isTablet ? '1rem' : '1.2rem',
                    color: 'var(--text-secondary)',
                    marginBottom: isMobile ? '1.25rem' : '2rem',
                    lineHeight: 1.6,
                    maxWidth: '550px'
                }}>
                    CampusMart isn't just a marketplace — it's a movement. The ultimate hub where <strong>trust meets affordability.</strong> From textbooks to the latest tech, every deal fits a student's budget.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => setCurrentPage('marketplace')}
                        style={{ padding: isMobile ? '0.7rem 1.25rem' : '0.9rem 1.75rem', fontSize: isMobile ? '0.9rem' : '1rem' }}
                    >
                        Start Exploring
                    </button>
                    <button
                        onClick={() => setCurrentPage('community')}
                        style={{
                            padding: isMobile ? '0.7rem 1.25rem' : '0.9rem 1.75rem',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '10px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--campus-blue)'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        Join Community
                    </button>
                </div>

                <div style={{ marginTop: isMobile ? '1.5rem' : '2.5rem', display: 'flex', gap: isMobile ? '1.5rem' : '2.5rem', opacity: 0.85, flexWrap: 'wrap' }}>
                    {[
                        { value: '100%', label: 'Student Verified', color: 'var(--campus-blue)' },
                        { value: 'Best', label: 'Comrade Rates', color: 'var(--jiji-green)' },
                        { value: 'Fast', label: 'On-Campus Pickup', color: 'var(--jiji-orange)' },
                    ].map(stat => (
                        <div key={stat.label}>
                            <div style={{ fontWeight: 900, fontSize: isMobile ? '1.1rem' : '1.4rem', color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop hero image — right column */}
            {!isTablet && (
                <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                    <img src="/hero%20section.png" alt="Safe Student Trading" style={{ width: '100%', height: '500px', objectFit: 'cover' }} />
                </div>
            )}
        </div>
    );
};

export default Hero;
