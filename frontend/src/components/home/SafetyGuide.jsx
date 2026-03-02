import React from 'react';

const safetySteps = [
    {
        title: 'The Public Stage Rule',
        desc: 'Meet at very busy spots like the Stage, a Petrol Station, or near a Police Station. Never follow a seller into dark alleys or obscure hostels.',
        image: '/stage.png'
    },
    {
        title: 'Comrade Power',
        desc: "A deal off-campus shouldn't be a solo mission. Carry a fellow comrade along—it's safer and makes negotiation easier when you have backup.",
        image: '/comrade%20power.png'
    },
    {
        title: 'Test-before-PIN',
        desc: 'For gadgets, check every function before you think of opening M-Pesa. Once that PIN is entered, the deal is final. Verify everything on the spot.',
        image: '/test%20before%20pin.png'
    }
];

const SafetyGuide = () => {
    return (
        <div style={{ background: 'var(--white)', padding: '4rem 0', margin: '4rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 2rem' }}>
                <h2 style={{ fontSize: '3rem', color: 'var(--campus-blue)', marginBottom: '1.5rem' }}>Comrade Safe-Trade Initiative</h2>
                <p style={{ fontSize: '1.35rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
                    Trading in off-campus markets requires extra vigilance. We've built these guidelines to ensure every comrade stays protected.
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>
                {safetySteps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '800px',
                            height: '500px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
                            marginBottom: '2.5rem',
                            borderBottom: index % 2 === 0 ? '6px solid var(--jiji-green)' : '6px solid var(--jiji-orange)'
                        }}>
                            <img
                                src={step.image}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                alt={step.title}
                            />
                        </div>
                        <div style={{ textAlign: 'center', maxWidth: '750px' }}>
                            <h3 style={{ fontSize: '2.25rem', marginBottom: '1.25rem', color: 'var(--campus-blue)', fontWeight: 800 }}>{step.title}</h3>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafetyGuide;
