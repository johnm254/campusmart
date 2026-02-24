import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';

const isIOS = () => {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
};

const isInStandaloneMode = () => {
    return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
};

const DownloadPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showAndroid, setShowAndroid] = useState(false);
    const [showIOS, setShowIOS] = useState(false);

    useEffect(() => {
        // Already installed? Show nothing.
        if (isInStandaloneMode()) return;

        const dismissed = sessionStorage.getItem('pwa_dismissed');
        if (dismissed) return;

        if (isIOS()) {
            // iOS requires a manual "Add to Home Screen" flow
            setTimeout(() => setShowIOS(true), 4000);
        } else {
            const handleBeforeInstall = (e) => {
                e.preventDefault();
                setDeferredPrompt(e);
                setTimeout(() => setShowAndroid(true), 3000);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstall);

            window.addEventListener('appinstalled', () => {
                setShowAndroid(false);
                setDeferredPrompt(null);
            });

            return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setShowAndroid(false);
    };

    const handleDismiss = () => {
        setShowAndroid(false);
        setShowIOS(false);
        sessionStorage.setItem('pwa_dismissed', 'true');
    };

    const bannerStyle = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        padding: '1.1rem 1.25rem',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.9rem',
        border: '2px solid #1d3d6e',
        animation: 'slideUpPrompt 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    };

    const iconBox = {
        width: '46px',
        height: '46px',
        background: '#1d3d6e',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        flexShrink: 0
    };

    const dismissBtn = {
        background: '#f1f5f9',
        border: 'none',
        color: '#64748b',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0
    };

    return (
        <>
            <style>{`
                @keyframes slideUpPrompt {
                    from { transform: translateX(-50%) translateY(100px); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `}</style>

            {/* Android / Desktop Chrome prompt */}
            {showAndroid && (
                <div style={bannerStyle}>
                    <div style={iconBox}><Smartphone size={24} /></div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>Install CampusMart App</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Works offline · Fast · Home screen access</div>
                    </div>
                    <button
                        onClick={handleInstall}
                        style={{
                            background: '#1d3d6e',
                            color: 'white',
                            border: 'none',
                            padding: '0.6rem 1rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            flexShrink: 0
                        }}
                    >
                        <Download size={15} /> Install
                    </button>
                    <button style={dismissBtn} onClick={handleDismiss}><X size={16} /></button>
                </div>
            )}

            {/* iOS Safari prompt */}
            {showIOS && (
                <div style={{ ...bannerStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={iconBox}><Share size={22} /></div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>Add to Home Screen</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Install CampusMart on iOS</div>
                            </div>
                        </div>
                        <button style={dismissBtn} onClick={handleDismiss}><X size={16} /></button>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '0.85rem 1rem', width: '100%', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                        Tap the <strong style={{ color: '#1d3d6e' }}>Share</strong> icon <span style={{ fontSize: '1rem' }}>⎦↑</span> at the bottom of your browser, then select <strong style={{ color: '#1d3d6e' }}>"Add to Home Screen"</strong>.
                    </div>
                </div>
            )}
        </>
    );
};

export default DownloadPrompt;
