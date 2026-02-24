import React from 'react'
import { AppProvider, useApp } from './AppContext'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Messages from './pages/Messages'
import ResetPassword from './pages/ResetPassword'
import Community from './pages/Community'
import Accommodation from './pages/Accommodation'
import AuthModal from './components/modals/AuthModal'
import SellModal from './components/modals/SellModal'
import NotificationContainer from './components/ui/NotificationContainer'
import Feedback from './components/feedback/Feedback'
import Chatbot from './components/support/Chatbot'
import DownloadPrompt from './components/ui/DownloadPrompt'
import Footer from './components/layout/Footer'
import InfoModal from './components/modals/InfoModal'

const AppContent = () => {
    const {
        siteSettings,
        currentPage,
        setCurrentPage,
        user,
        infoModal,
        closeInfo,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSellModalOpen,
        setIsSellModalOpen
    } = useApp();

    React.useEffect(() => {
        // Handle direct links like ?token=...
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('token') && urlParams.has('email')) {
            setCurrentPage('reset-password');
        }
    }, []);

    const renderPage = () => {
        // Maintenance Mode Check
        if (siteSettings.maintenance_mode === 'true' && !user?.is_admin && currentPage !== 'admin') {
            return (
                <div style={{ textAlign: 'center', padding: '150px 20px' }}>
                    <h1 style={{ fontSize: '3rem', color: '#1d3d6e', marginBottom: '1rem' }}>Slight Turbulence! ✈️</h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
                        CampusMart is currently undergoing scheduled maintenance to improve your experience. We'll be back shortly!
                    </p>
                </div>
            );
        }

        // Protected routes check
        const protectedPages = ['wishlist', 'dashboard', 'settings', 'messages'];
        if (!user && protectedPages.includes(currentPage)) {
            // Automatically open auth and show home
            setTimeout(() => setIsAuthModalOpen(true), 100);
            return <Home />;
        }

        switch (currentPage) {
            case 'home': return <Home />;
            case 'marketplace': return <Marketplace />;
            case 'wishlist': return <Wishlist />;
            case 'admin': return <Admin />;
            case 'dashboard': return <Dashboard />;
            case 'settings': return <Settings />;
            case 'messages': return <Messages />;
            case 'community': return <Community />;
            case 'accommodation': return <Accommodation />;
            case 'reset-password': return <ResetPassword />;
            default: return <Home />;
        }
    };

    return (
        <div className="app">
            {siteSettings.announcement && (
                <div style={{ background: '#1d3d6e', color: 'white', padding: '0.75rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                    {siteSettings.announcement}
                </div>
            )}
            <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} onOpenSell={() => setIsSellModalOpen(true)} />
            <main>
                {renderPage()}
            </main>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <SellModal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} />
            <InfoModal
                isOpen={infoModal.isOpen}
                onClose={closeInfo}
                title={infoModal.title}
                content={infoModal.content}
            />
            <DownloadPrompt />
            <Chatbot />
            <Feedback />
            <NotificationContainer />
            <Footer />
        </div>
    )
};

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    )
}

export default App
