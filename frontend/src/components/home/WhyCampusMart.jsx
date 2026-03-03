import React from 'react';
import { Home, ShoppingBag, MessageCircle, MapPin, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { useApp } from '../../AppContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

// ΓöÇΓöÇ Pain-point cards ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const PROBLEMS = [
    {
        color: '#ee1c24', bg: '#ffebee', border: '#ee1c24',
        problem: 'House Hunting Nightmares',
        solution: 'Scroll verified landlord listings, see real photos, GPS maps & contact them directly ΓÇö zero agents.',
        cta: 'accommodation'
    },
    {
        color: '#8cc63f', bg: '#f1f8e9', border: '#8cc63f',
        problem: 'Overpriced Campus Goods',
        solution: 'Buy & sell textbooks, electronics, furniture at genuine comrade prices from students who understand your budget.',
        cta: 'marketplace'
    },
    {
        color: '#1d3d6e', bg: '#ebf2f7', border: '#00aeef',
        problem: 'No Trusted Marketplace',
        solution: 'Every user is a real student or verified trader. Chat, review, and transact with confidence on campus.',
        cta: 'community'
    }
];

// ΓöÇΓöÇ Feature highlights ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
const FEATURES = [
    { icon: Home, color: '#1d3d6e', bg: '#ebf2f7', label: 'Student Accommodation', desc: 'Hostels, single rooms, bed-sitters, apartments ΓÇö all sourced directly from landlords near your campus. No agents.', badge: 'Direct from Landlord' },
    { icon: ShoppingBag, color: '#8cc63f', bg: '#f1f8e9', label: 'Campus Marketplace', desc: 'From textbooks to laptops, furniture to fashion ΓÇö buy and sell anything a student needs at honest prices.', badge: 'Comrade Prices' },
    { icon: MessageCircle, color: '#ee1c24', bg: '#ffebee', label: 'Real-Time Chat', desc: 'Message sellers, landlords, and traders directly. Negotiate, ask questions, seal the deal. No calls needed.', badge: 'Instant Messaging' },
    { icon: MapPin, color: '#00aeef', bg: '#e1f5fe', label: 'GPS Location Pins', desc: 'Houses and rental listings show exact GPS pinpoints on a live mini-map so you never get lost finding your next home.', badge: 'Live Maps' },
    { icon: Shield, color: '#1d3d6e', bg: '#ebf2f7', label: 'Trusted Community', desc: 'Built on peer reviews and student ratings. Deal with people your fellow students have already vetted.', badge: 'Peer-Reviewed' },
    { icon: Zap, color: '#8cc63f', bg: '#f1f8e9', label: '100% Free Always', desc: 'No listing fees, no commissions, no hidden charges. Post your goods or rooms completely free ΓÇö forever.', badge: 'Zero Fees' }
];

const WhyCampusMart = () => {
    const { user, setIsAuthModalOpen, setIsSellModalOpen, setCurrentPage } = useApp();
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 900px)');

    return (
        <section style={{
            padding: isMobile ? '3rem 1rem 4rem' : '5rem 2rem 6rem',
            background: 'linear-gradient(to bottom, #f8fafc 0%, white 100%)',
            borderRadius: isMobile ? '24px' : '40px',
            margin: '2rem 0'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* ΓòÉΓòÉ SECTION 1 ΓÇö Problems We Solve ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '4rem' }}>
                    <div style={{
                        display: 'inline-block', background: '#fff9e6', border: '1px solid #8cc63f',
                        borderRadius: '50px', padding: '0.4rem 1.1rem',
                        fontSize: '0.8rem', fontWeight: 800, color: '#1d3d6e', marginBottom: '1rem',
                        letterSpacing: '0.5px'
                    }}>
                        WHY WE BUILT THIS
                    </div>
                    <h2 style={{ fontSize: isMobile ? '2rem' : '3rem', fontWeight: 900, color: '#1d3d6e', lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-1.5px' }}>
                        We solved the 3 biggest{' '}
                        <span style={{ color: '#8cc63f' }}>student struggles.</span>
                    </h2>
                    <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#64748b', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
                        Every student faces the same pain ΓÇö overpriced goods, shady landlords, and nowhere trusted to turn. CampusMart ends that.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: isMobile ? '3rem' : '5rem' }}>
                    {PROBLEMS.map((item, i) => {
                        const ProblemIcon = [TrendingUp, ShoppingBag, Shield][i];
                        return (
                            <div
                                key={i}
                                onClick={() => setCurrentPage(item.cta)}
                                style={{
                                    background: 'white', border: `2px solid ${item.border}`,
                                    borderRadius: '24px', padding: isMobile ? '1.75rem' : '2.25rem',
                                    cursor: 'pointer', transition: 'all 0.3s ease',
                                    display: 'flex', flexDirection: 'column', gap: '1rem',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${item.color}25`; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'; }}
                            >
                                <div style={{
                                    width: '60px', height: '60px',
                                    background: `linear-gradient(135deg, ${item.bg}, ${item.color}20)`,
                                    borderRadius: '18px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <ProblemIcon size={30} color={item.color} strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: item.color, margin: 0, letterSpacing: '-0.3px' }}>
                                    {item.problem}
                                </h3>
                                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                                    <span style={{ fontWeight: 700, color: '#1e293b' }}>Our Solution:</span> {item.solution}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* ΓòÉΓòÉ SECTION 2 ΓÇö Housing Hero ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    maxWidth: '900px',
                    margin: '0 auto',
                    marginBottom: isMobile ? '3rem' : '6rem'
                }}>
                    {/* Content Column */}
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: '#f1f8e9', color: '#8cc63f',
                            padding: '0.45rem 1.1rem', borderRadius: '50px',
                            fontSize: '0.8rem', fontWeight: 800, marginBottom: '1.25rem',
                            letterSpacing: '0.5px'
                        }}>
                            <Home size={16} style={{ marginRight: '0.4rem' }} /> END THE HOUSING HUSTLE
                        </div>
                        <h2 style={{
                            fontSize: isMobile ? '2rem' : isTablet ? '2.6rem' : '3.4rem',
                            lineHeight: 1.08, marginBottom: '1.25rem',
                            color: '#1d3d6e', fontWeight: 900,
                            letterSpacing: isMobile ? '-0.8px' : '-1.5px'
                        }}>
                            Find Your Student<br />
                            <span style={{ color: '#8cc63f' }}>Home. Fast. Free.</span>
                        </h2>
                        <p style={{ fontSize: isMobile ? '0.9rem' : '1.05rem', color: '#64748b', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '620px', margin: '0 auto 1.75rem' }}>
                            Stop wasting weekends physically searching. Browse <strong>hostels, single rooms, bed-sitters and fully furnished apartments</strong> listed by real landlords near your campus. See GPS maps, real photos, and contact details ΓÇö all in one tap.
                        </p>
                        {/* Mini benefit checklist */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', alignItems: 'flex-start', maxWidth: '520px', margin: '0 auto 2rem' }}>
                            {[
                                { icon: MapPin, text: 'GPS pinpointed exact locations' },
                                { icon: TrendingUp, text: 'Compare prices & amenities side-by-side' },
                                { icon: MessageCircle, text: 'WhatsApp landlords directly' },
                                { icon: Shield, text: 'Filter by room type, budget & distance to campus' }
                            ].map(pt => {
                                const IconComp = pt.icon;
                                return (
                                    <div key={pt.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.92rem', color: '#334155', fontWeight: 600 }}>
                                        <span style={{ width: '24px', height: '24px', background: '#f1f8e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <IconComp size={13} color="#8cc63f" strokeWidth={3} />
                                        </span>
                                        {pt.text}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={() => setCurrentPage('accommodation')} className="btn btn-primary" style={{ borderRadius: '12px', padding: '0.9rem 1.75rem', boxShadow: '0 8px 20px rgba(140,198,63,0.3)', background: '#8cc63f' }}>
                                Browse All Listings
                            </button>
                            <button onClick={() => user ? setIsSellModalOpen(true) : setIsAuthModalOpen(true)} style={{ background: 'none', border: '2px solid #1d3d6e', color: '#1d3d6e', borderRadius: '12px', padding: '0.9rem 1.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                Post Your House
                            </button>
                        </div>
                        {/* Stats row */}
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {[
                                { value: '0%', label: 'Commission Fees', color: '#8cc63f' },
                                { value: 'GPS', label: 'Exact Location', color: '#1d3d6e' },
                                { value: 'Direct', label: 'Landlord Contact', color: '#ee1c24' },
                            ].map(s => (
                                <div key={s.label}>
                                    <div style={{ fontWeight: 900, fontSize: '1.3rem', color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ΓòÉΓòÉ SECTION 3 ΓÇö Features Grid ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
                <div style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}>
                    <h2 style={{ fontSize: isMobile ? '2rem' : '2.8rem', fontWeight: 900, color: '#1d3d6e', letterSpacing: '-1.2px', marginBottom: '0.85rem' }}>
                        Everything a student needs,{' '}
                        <span style={{ color: '#8cc63f' }}>one platform.</span>
                    </h2>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '650px', margin: '0 auto', lineHeight: 1.7 }}>
                        We don't just list items ΓÇö we solve the real daily problems campus life throws at you.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: isMobile ? '3rem' : '4.5rem' }}>
                    {FEATURES.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} style={{
                                background: 'white', padding: '2.25rem', borderRadius: '24px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 10px 15px -3px rgba(0,0,0,0.04)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                border: '2px solid #f1f5f9',
                                cursor: 'pointer'
                            }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `0 20px 40px ${feat.color}20`; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.04)'; }}
                            >
                                <div style={{ width: '58px', height: '58px', borderRadius: '16px', background: `linear-gradient(135deg, ${feat.bg}, ${feat.color}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <Icon color={feat.color} size={28} strokeWidth={2.5} />
                                </div>
                                <div style={{
                                    display: 'inline-block', background: feat.bg, color: feat.color,
                                    border: `1.5px solid ${feat.color}40`,
                                    fontSize: '0.7rem', fontWeight: 800, borderRadius: '20px',
                                    padding: '0.2rem 0.7rem', marginBottom: '0.85rem', letterSpacing: '0.3px'
                                }}>{feat.badge}</div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.6rem', letterSpacing: '-0.3px' }}>{feat.label}</h3>
                                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
                            </div>
                        );
                    })}
                </div>

                {/* ΓòÉΓòÉ FINAL CTA banner ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
                <div style={{
                    background: 'linear-gradient(135deg, #1d3d6e 0%, #00aeef 100%)',
                    padding: isMobile ? '2.5rem 1.75rem' : '3.5rem',
                    borderRadius: '28px',
                    color: 'white',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: isMobile ? 'flex-start' : 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.75rem',
                    boxShadow: '0 20px 50px rgba(29,61,110,0.35)'
                }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#8cc63f', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Users size={16} /> Traders & Landlords Welcome
                        </div>
                        <h3 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
                            Reach thousands of students ΓÇö for free.
                        </h3>
                        <p style={{ opacity: 0.85, fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.7, margin: 0 }}>
                            Post your goods, rooms, or services on CampusMart and connect with the largest pool of active student buyers in your area. No fees. No commission. Ever.
                        </p>
                    </div>
                    <button
                        onClick={() => user ? setIsSellModalOpen(true) : setIsAuthModalOpen(true)}
                        style={{
                            background: '#8cc63f', color: 'white',
                            padding: '1.1rem 2.5rem', borderRadius: '16px',
                            border: 'none', fontWeight: 800, fontSize: '1.05rem',
                            cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                            whiteSpace: 'nowrap', flexShrink: 0,
                            transition: 'all 0.3s ease',
                            display: 'flex', alignItems: 'center', gap: '0.6rem'
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#7ab532'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#8cc63f'; }}
                    >
                        <Zap size={20} fill="white" /> Start Posting Free
                    </button>
                </div>
            </div>
        </section>
    );
};

export default WhyCampusMart;
