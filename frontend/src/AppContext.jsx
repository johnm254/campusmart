import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from './lib/api';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // ΓöÇΓöÇ Core State ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [activeCategory, setActiveCategory] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [siteSettings, setSiteSettings] = useState({ site_name: 'CampusMart', maintenance_mode: 'false', announcement: '' });
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isAdminLockModalOpen, setIsAdminLockModalOpen] = useState(false);
    const [infoModal, setInfoModal] = useState({ isOpen: false, title: '', content: null });
    const prevUnreadRef = useRef(0);

    // ΓöÇΓöÇ Notifications ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const addNotification = (title, message, type = 'success', icon = 'check-circle') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, title, message, type, icon }]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
    };

    const removeNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

    // ΓöÇΓöÇ Info Modal ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const showInfo = (title, content) => setInfoModal({ isOpen: true, title, content });
    const closeInfo = () => setInfoModal(prev => ({ ...prev, isOpen: false }));

    // ΓöÇΓöÇ Navigation helper ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const navigateWithFilter = (page, category = 'all') => {
        setActiveCategory(category);
        setCurrentPage(page);
    };

    // ΓöÇΓöÇ Auth ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('admin_access_unlocked');
        setUser(null);
        setWishlist([]);
        setCurrentPage('home');
        addNotification('Signed out', 'You have been successfully logged out.', 'info');
    };

    // ΓöÇΓöÇ Wishlist ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    const toggleWishlist = async (product) => {
        if (!user) { setIsAuthModalOpen(true); return; }
        try {
            const res = await api.toggleWishlist(product.id);
            if (res.action === 'added') {
                setWishlist(prev => [...prev, product]);
                addNotification('Added to Wishlist', product.title, 'success', 'heart');
            } else {
                setWishlist(prev => prev.filter(p => p.id !== product.id));
                addNotification('Removed from Wishlist', product.title, 'info', 'heart');
            }
        } catch {
            addNotification('Error', 'Failed to update wishlist', 'error');
        }
    };

    // ΓöÇΓöÇ Effects ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

    // Helper: decode JWT payload (no signature check, just read expiry)
    const decodeJwtExpiry = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp ? payload.exp * 1000 : null; // convert to ms
        } catch {
            return null;
        }
    };

    // Restore session from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!saved) return;
        try {
            // Check if the JWT token is expired
            if (token) {
                const expiry = decodeJwtExpiry(token);
                if (expiry && Date.now() > expiry) {
                    // Token expired ΓÇö clear session silently
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    return;
                }
            }

            const parsed = JSON.parse(saved);
            // Expire local verification if past date
            if (parsed.is_verified && parsed.verified_until && new Date(parsed.verified_until) < new Date()) {
                parsed.is_verified = false;
                localStorage.setItem('user', JSON.stringify(parsed));
            }
            setUser(parsed);
        } catch {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    }, []);

    // Listen for session-expired events fired by the API layer
    useEffect(() => {
        const handleSessionExpired = () => {
            setUser(null);
            setWishlist([]);
            setUnreadCount(0);
            prevUnreadRef.current = 0;
            sessionStorage.removeItem('admin_access_unlocked');
            addNotification('Session Expired', 'Your session has ended. Please sign in again.', 'warning');
        };
        window.addEventListener('session-expired', handleSessionExpired);
        return () => window.removeEventListener('session-expired', handleSessionExpired);
    }, []);

    // Load wishlist when user changes
    useEffect(() => {
        if (!user) { setWishlist([]); return; }
        api.getWishlist()
            .then(data => { if (Array.isArray(data)) setWishlist(data); })
            .catch(() => { });
    }, [user]);

    // Fetch public site settings once on mount
    useEffect(() => {
        api.getPublicSettings()
            .then(data => setSiteSettings(prev => ({ ...prev, ...data })))
            .catch(() => { });
    }, []);

    // Poll for unread messages every 10 seconds
    useEffect(() => {
        if (!user) { prevUnreadRef.current = 0; setUnreadCount(0); return; }
        const poll = async () => {
            try {
                const data = await api.getUnreadCount();
                if (data && typeof data.count === 'number') {
                    if (data.count > prevUnreadRef.current) {
                        addNotification('New Message', `You have ${data.count} unread message${data.count > 1 ? 's' : ''}.`, 'info');
                    }
                    prevUnreadRef.current = data.count;
                    setUnreadCount(data.count);
                }
            } catch { }
        };
        poll();
        const interval = setInterval(poll, 10000);
        return () => clearInterval(interval);
    }, [user]);

    // ΓöÇΓöÇ Context value ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
    return (
        <AppContext.Provider value={{
            user, setUser,
            wishlist, toggleWishlist,
            currentPage, setCurrentPage,
            activeCategory, setActiveCategory, navigateWithFilter,
            notifications, addNotification, removeNotification,
            infoModal, showInfo, closeInfo,
            logout,
            isAuthModalOpen, setIsAuthModalOpen,
            isSellModalOpen, setIsSellModalOpen,
            isAdminLockModalOpen, setIsAdminLockModalOpen,
            unreadCount, setUnreadCount,
            siteSettings, setSiteSettings,
        }}>
            {children}
        </AppContext.Provider>
    );
};
