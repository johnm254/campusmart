import React from 'react';
import { Target, Users, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../../AppContext';

const WhyCampusMart = () => {
    const { user, setIsAuthModalOpen, setIsSellModalOpen } = useApp();

    const handlePostAd = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            setIsSellModalOpen(true);
        }
    };

    return (
        <section style={{
            padding: '5rem 2rem',
            background: 'linear-gradient(to bottom, #f8fafc 0%, white 100%)',
            borderRadius: '40px',
            margin: '2rem 0'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--campus-blue)', marginBottom: '1rem' }}>
                        Built for the <span style={{ color: 'var(--jiji-green)' }}>Comrade Hustle.</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
                        CampusMart was founded with a single mission: to make sure no student pays "mall prices" for campus essentials. We're reclaiming the marketplace for the comrades.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {/* Mission Item 1 */}
                    <div style={cardStyle}>
                        <div style={{ ...iconBg, background: '#e0f2fe' }}>
                            <Target color="#0284c7" size={28} />
                        </div>
                        <h3 style={titleStyle}>The Vision</h3>
                        <p style={descStyle}>
                            Establishing a frictionless ecosystem where students can swap value without the middleman markups.
                        </p>
                    </div>

                    {/* Mission Item 2 */}
                    <div style={cardStyle}>
                        <div style={{ ...iconBg, background: '#dcfce7' }}>
                            <Zap color="#16a34a" size={28} />
                        </div>
                        <h3 style={titleStyle}>Comrade Rates</h3>
                        <p style={descStyle}>
                            We actively moderate pricing expectations. If it's on CampusMart, it's guaranteed to be the best deal in JKUAT and beyond.
                        </p>
                    </div>

                    {/* Mission Item 3 */}
                    <div style={cardStyle}>
                        <div style={{ ...iconBg, background: '#fef3c7' }}>
                            <ShieldCheck color="#d97706" size={28} />
                        </div>
                        <h3 style={titleStyle}>Trust First</h3>
                        <p style={descStyle}>
                            Every seller is student-verified. Deal with confidence knowing your fellow comrades have your back.
                        </p>
                    </div>

                    {/* Mission Item 4 */}
                    <div style={cardStyle}>
                        <div style={{ ...iconBg, background: '#f3e8ff' }}>
                            <Users color="#9333ea" size={28} />
                        </div>
                        <h3 style={titleStyle}>Community Driven</h3>
                        <p style={descStyle}>
                            Beyond trading, we're building a network. Connect, share, and grow with the most vibrant student community in Kenya.
                        </p>
                    </div>
                </div>

                <div style={{
                    marginTop: '4rem',
                    background: 'var(--campus-blue)',
                    padding: '3rem',
                    borderRadius: '24px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem'
                }}>
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to join the hustle?</h3>
                        <p style={{ opacity: 0.9 }}>Start listing your items today and help other comrades save money.</p>
                    </div>
                    <button
                        onClick={handlePostAd}
                        style={{
                            background: 'var(--jiji-green)',
                            color: 'white',
                            padding: '1rem 2.5rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        Post Your First Ad
                    </button>
                </div>
            </div>
        </section>
    );
};

const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease',
};

const iconBg = {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem'
};

const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#1e293b',
    marginBottom: '0.75rem'
};

const descStyle = {
    fontSize: '0.95rem',
    color: '#64748b',
    lineHeight: '1.6'
};

export default WhyCampusMart;
