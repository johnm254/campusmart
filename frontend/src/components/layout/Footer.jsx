import React from 'react';
import { useApp } from '../../AppContext';
import { Facebook, Instagram, Twitter, MessageCircle, MapPin, Mail, Phone } from 'lucide-react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Footer = () => {
    const { setCurrentPage, showInfo, navigateWithFilter, setIsAdminLockModalOpen } = useApp();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const triggerAdminPrompt = () => {
        setIsAdminLockModalOpen(true);
    };

    return (
        <footer style={{ background: 'var(--campus-blue)', color: 'white', padding: 0 }}>
            {/* Campus Skyline Silhouette */}
            <div style={{ background: '#f0f7ff', lineHeight: 0, paddingBottom: 0 }}>
                <svg viewBox="0 0 1400 120" preserveAspectRatio="xMidYMax slice" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <path d="M0,120 L1400,120 L1400,105 
            L1380,105 L1380,60 L1340,60 L1340,105 
            L1320,105 L1320,80 L1280,80 L1280,105 
            L1260,105 L1260,30 L1230,30 L1230,105 
            L1210,105 L1210,70 L1180,70 L1180,105 
            L1160,105 L1160,0 L1110,0 L1110,105 
            L1090,105 L1090,65 L1050,65 L1050,105 
            L1030,105 L1030,85 L990,85 L990,105 
            L970,105 L970,40 L930,40 L930,105 
            L910,105 L910,75 L870,75 L870,105 
            L850,105 L850,20 L810,20 L810,105 
            L790,105 L790,80 L750,80 L750,105 
            L730,105 L730,50 L710,50 L710,35 L690,35 L690,50 L670,50 L670,105 
            L650,105 L650,70 L610,70 L610,105 
            L590,105 L590,15 L550,15 L550,105 
            L530,105 L530,80 L490,80 L490,105 
            L470,105 L470,45 L430,45 L430,105 
            L410,105 L410,85 L370,85 L370,105 
            L350,105 L350,25 L310,25 L310,105 
            L290,105 L290,75 L250,75 L250,105 
            L230,105 L230,55 L210,55 L210,40 L190,40 L190,55 L170,55 L170,105 
            L150,105 L150,70 L110,70 L110,105 
            L90,105 L90,35 L60,35 L60,105 
            L40,105 L40,80 L0,80 Z" fill="#28a745" />
                </svg>
            </div>

            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', textAlign: 'left', alignItems: 'start', paddingTop: '38px', paddingBottom: '0.5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
                <div>
                    <h3 style={{ color: 'var(--jiji-green)', fontSize: '1.15rem', marginBottom: '0.6rem', marginTop: 0 }}>Marketplace</h3>
                    <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1rem', fontSize: '0.95rem', padding: 0 }}>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setCurrentPage('home')}>Home</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'all')}>All items</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'furniture')}>Furniture</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'outfit')}>Outfit</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'utensils')}>Utensils</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'appliances')}>Appliances</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => navigateWithFilter('marketplace', 'accessories')}>Accessories</span></li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ color: 'var(--jiji-green)', fontSize: '1.15rem', marginBottom: '0.6rem', marginTop: 0 }}>About & Safety</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', padding: 0 }}>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => showInfo('About CampusMart', (
                            <div>
                                <p><strong>CampusMart</strong> is the #1 student-to-student marketplace. Our mission is to make campus life affordable by providing a safe platform for comrades to buy and sell pre-loved items.</p>
                                <p>Founded by students, for students, we understand the hustle. Whether you're moving out and need to sell your bed, or looking for cheap study materials, we've got you covered.</p>
                            </div>
                        ))}>About Us</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => showInfo('Stay Safe Comrades!', (
                            <div>
                                <h3>Always Trade Safely</h3>
                                <ul>
                                    <li><strong>Meet in Public:</strong> Use the Juja Stage, Posta, or inside the school gates.</li>
                                    <li><strong>Verify the Item:</strong> Test electronics and check clothes for tears before paying.</li>
                                    <li><strong>Trust your Gut:</strong> If a deal looks too good to be true, it probably is a scam.</li>
                                    <li><strong>Never Go Alone:</strong> Use the "Comrade Power" ruleΓÇöbring a friend!</li>
                                </ul>
                            </div>
                        ))}>Safety Tips</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => showInfo('Terms & Conditions', (
                            <div>
                                <p>By using CampusMart, you agree to follow the "Comrade Code":</p>
                                <ol>
                                    <li>Be honest about the condition of your items.</li>
                                    <li>No selling of illegal substances or school property.</li>
                                    <li>Respect your fellow buyers and sellers.</li>
                                    <li>CampusMart is a platform; we are not responsible for transactions gone wrong.</li>
                                </ol>
                            </div>
                        ))}>Terms & Conditions</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => showInfo('Privacy Policy', (
                            <div>
                                <p>We value your privacy like we value a full meal at Mess:</p>
                                <ul>
                                    <li>We only collect your email/phone to help you trade.</li>
                                    <li>Your data is encrypted and never sold to 3rd parties.</li>
                                    <li>You can delete your account and data anytime from the settings.</li>
                                </ul>
                            </div>
                        ))}>Privacy Policy</span></li>
                    </ul>
                </div>

                <div>
                    <h3 style={{ color: 'var(--jiji-green)', fontSize: '1.15rem', marginBottom: '0.6rem', marginTop: 0 }}>Support</h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem', padding: 0 }}>
                        <li><span style={{ cursor: 'default', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> All University Campuses</span></li>
                        <li><span style={{ cursor: 'default', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={16} /> campusmart.care@gmail.com</span></li>
                        <li><span style={{ cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => showInfo('Contact Support', (
                            <div>
                                <p>Need help with a trade or found a bug? Reach out to us!</p>
                                <p><strong>Email:</strong> campusmart.care@gmail.com</p>
                                <p><strong>WhatsApp:</strong> +254 108 254 465</p>
                            </div>
                        ))}><Phone size={16} /> Contact Support</span></li>
                    </ul>
                </div>
            </div>

            {/* Socials and Copyright */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem 0', background: 'var(--campus-blue)' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: isMobile ? '0 1rem' : '0 4%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: '40px' }} />
                        </div>

                        <div
                            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" style={{ height: '40px' }} />
                        </div>

                        <p
                            className="admin-trigger"
                            style={{
                                opacity: 0.9,
                                fontSize: '0.95rem',
                                fontWeight: 500,
                                color: 'white',
                                margin: 0,
                                cursor: 'pointer',
                                userSelect: 'none',
                                padding: '10px 20px',
                                position: 'relative',
                                zIndex: 1000
                            }}
                            onClick={(e) => {
                                // Fallback: 5 clicks also triggers it
                                window.adminClicks = (window.adminClicks || 0) + 1;
                                if (window.adminClicks >= 5) {
                                    window.adminClicks = 0;
                                    triggerAdminPrompt();
                                }
                                clearTimeout(window.adminTimer);
                                window.adminTimer = setTimeout(() => { window.adminClicks = 0; }, 2000);
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation();
                                triggerAdminPrompt();
                            }}
                        >
                            © 2026 Campus Student Marketplace. All rights reserved.
                        </p>

                        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                            <a href="#" style={{ color: '#1877F2', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Facebook size={18} /></a>
                            <a href="#" style={{ color: '#E4405F', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Instagram size={18} /></a>
                            <a href="#" style={{ color: '#000000', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Twitter size={18} /></a>
                            <a href="#" style={{ color: '#25D366', background: 'white', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={18} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
