import React, { useState, useEffect } from 'react';
import { useApp } from '../../AppContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ShoppingBag, Home, ArrowRight, Zap, Users, Star, TrendingUp, Search, MessageSquare, Handshake } from 'lucide-react';

const AnimatedStat = ({ end, label, color, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 25);
        return () => clearInterval(timer);
    }, [end]);
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: '1.6rem', color, letterSpacing: '-0.5px' }}>
                {prefix}{count.toLocaleString()}{suffix}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>{label}</div>
        </div>
    );
};

const Hero = () => {
    const { setCurrentPage, user, setIsAuthModalOpen, setIsSellModalOpen } = useApp();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 900px)');

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '1.5rem 1rem 2rem' : isTablet ? '2.5rem 1.5rem 3rem' : '4rem 2rem 5rem' }}>

            {/* ── Top badge ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: isMobile ? '1.5rem' : '2.5rem' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    background: 'linear-gradient(135deg, #ebf2f7, #e8f5e9)',
                    border: '1px solid #8cc63f', borderRadius: '50px',
                    padding: '0.5rem 1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#1d3d6e',
                    boxShadow: '0 2px 8px rgba(29,61,110,0.08)'
                }}>
                    <Zap size={16} color="#8cc63f" fill="#8cc63f" />
                    100% FREE FOR ALL STUDENTS, TRADERS & LANDLORDS
                </div>
            </div>

            {/* ── Main tagline ── */}
            <div style={{ textAlign: 'center', marginBottom: isMobile ? '1.75rem' : '3rem' }}>
                <h1 style={{
                    fontSize: isMobile ? '2rem' : isTablet ? '2.8rem' : '4rem',
                    lineHeight: 1.08, fontWeight: 900,
                    letterSpacing: isMobile ? '-0.5px' : '-2px',
                    color: 'var(--campus-blue)',
                    marginBottom: '1rem'
                }}>
                    Your Campus.{' '}
                    <span style={{ color: 'var(--jiji-green)' }}>Your Market.</span>
                    <br />
                    <span style={{ color: 'var(--jiji-orange)' }}>Your Home.</span>
                </h1>
                <p style={{
                    fontSize: isMobile ? '0.95rem' : isTablet ? '1.05rem' : '1.25rem',
                    color: '#475569', lineHeight: 1.65,
                    maxWidth: '680px', margin: '0 auto',
                    fontWeight: 500
                }}>
                    CampusMart bridges the gap between <strong style={{ color: 'var(--campus-blue)' }}>students</strong>,{' '}
                    <strong style={{ color: 'var(--jiji-green)' }}>campus traders</strong>, and{' '}
                    <strong style={{ color: 'var(--jiji-orange)' }}>landlords</strong> — ending the hustle of house hunting
                    and bringing every market good under one roof.
                </p>
            </div>

            {/* ── Dual CTA buttons ── */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? '2.5rem' : '4rem' }}>
                <button
                    className="btn btn-primary"
                    onClick={() => setCurrentPage('marketplace')}
                    style={{
                        padding: isMobile ? '0.85rem 1.5rem' : '1rem 2.25rem',
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        borderRadius: '14px', boxShadow: '0 8px 24px rgba(61,184,58,0.3)'
                    }}
                >
                    <ShoppingBag size={20} /> Shop the Marketplace
                </button>
                <button
                    onClick={() => setCurrentPage('accommodation')}
                    style={{
                        padding: isMobile ? '0.85rem 1.5rem' : '1rem 2.25rem',
                        fontSize: isMobile ? '0.95rem' : '1.05rem',
                        background: 'white',
                        border: '2px solid #1d3d6e',
                        borderRadius: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.6rem',
                        color: 'var(--campus-blue)',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(29,61,110,0.1)'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#1d3d6e'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--campus-blue)'; }}
                >
                    <Home size={20} /> Find Student Housing
                </button>
            </div>

            {/* ── 3-step How it Works ribbon ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap: isMobile ? '1rem' : '1.5rem',
                marginBottom: isMobile ? '2.5rem' : '4rem'
            }}>
                {[
                    {
                        step: '01', Icon: Search, color: '#1d3d6e', bg: '#ebf2f7', border: '#00aeef',
                        title: 'Discover Listings',
                        desc: 'Browse hundreds of campus goods, hostels, rooms & apartments posted by fellow students and verified landlords.'
                    },
                    {
                        step: '02', Icon: MessageSquare, color: '#8cc63f', bg: '#f1f8e9', border: '#8cc63f',
                        title: 'Connect Directly',
                        desc: 'Message sellers, traders and landlords in real-time. No agents, no commission, no middlemen — ever.'
                    },
                    {
                        step: '03', Icon: Handshake, color: '#ee1c24', bg: '#ffebee', border: '#ee1c24',
                        title: 'Deal at Campus Rates',
                        desc: 'Negotiate honest prices with people who understand the student hustle. Save more, stress less.'
                    }
                ].map((item, i) => {
                    const IconComponent = item.Icon;
                    return (
                        <div key={i} style={{
                            background: 'white',
                            border: `2px solid ${item.border}`,
                            borderRadius: '24px',
                            padding: isMobile ? '1.5rem' : '2rem',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}30`;
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }}>
                            <div style={{
                                position: 'absolute', top: '1.25rem', right: '1.25rem',
                                fontSize: '0.7rem', fontWeight: 800, color: item.color,
                                background: item.bg, padding: '0.25rem 0.65rem',
                                borderRadius: '20px', letterSpacing: '0.05em'
                            }}>STEP {item.step}</div>
                            <div style={{
                                width: '56px', height: '56px',
                                background: `linear-gradient(135deg, ${item.bg}, ${item.color}15)`,
                                borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '1rem'
                            }}>
                                <IconComponent size={28} color={item.color} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', letterSpacing: '-0.3px' }}>{item.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                    );
                })}
            </div>

            {/* ── Stats bar ── */}
            <div style={{
                background: 'linear-gradient(135deg, #1d3d6e 0%, #00aeef 100%)',
                borderRadius: '20px',
                padding: isMobile ? '1.5rem 1rem' : '2rem 3rem',
                display: 'grid',
                gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`,
                gap: '1.5rem',
                boxShadow: '0 20px 50px rgba(29,61,110,0.3)'
            }}>
                <AnimatedStat end={0} suffix="% Fees" label="Zero Commissions" color="#8cc63f" />
                <AnimatedStat end={5} suffix=" Photos" label="Free Per Listing" color="#ffffff" />
                <AnimatedStat end={3} suffix=" Sections" label="Market · Housing · Community" color="#8cc63f" />
                <AnimatedStat end={100} suffix="%" label="Student Driven" color="#ffffff" />
            </div>

            {/* ── Seller / Landlord CTA ── */}
            <div style={{
                marginTop: isMobile ? '2rem' : '3rem',
                display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                gap: '1rem', alignItems: 'center', justifyContent: 'center'
            }}>
                <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
                    Are you a trader or landlord?
                </p>
                <button
                    onClick={() => user ? setIsSellModalOpen(true) : setIsAuthModalOpen(true)}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: '2px solid #8cc63f',
                        color: '#8cc63f', borderRadius: '10px',
                        padding: '0.6rem 1.25rem', fontWeight: 800, fontSize: '0.9rem',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#8cc63f'; e.currentTarget.style.color = 'white'; }}
                    onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#8cc63f'; }}
                >
                    Post your listing free <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Hero;
