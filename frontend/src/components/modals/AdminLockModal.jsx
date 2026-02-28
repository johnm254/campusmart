import React, { useState } from 'react';
import { ShieldCheck, X, ChevronRight, Lock } from 'lucide-react';
import { useApp } from '../../AppContext';

const AdminLockModal = ({ isOpen, onClose }) => {
    const [code, setCode] = useState('');
    const { setCurrentPage, addNotification } = useApp();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const adminKeys = ["CAMPUS_ADMIN_2026", "#CAMPUS_ADMIN_2026#", "CAMPUS_ADMIN_2027", "#CAMPUS_ADMIN_2027#"];

        if (adminKeys.includes(code)) {
            sessionStorage.setItem('admin_access_unlocked', 'true');
            sessionStorage.setItem('admin_secret_key', code);
            setCurrentPage('admin');
            window.scrollTo(0, 0);
            addNotification('Access Granted', 'Welcome to Admin Console', 'success');
            onClose();
            setCode('');
        } else {
            addNotification('Access Denied', 'Invalid Administrator Secret', 'error');
            setCode('');
        }
    };

    return (
        <div className="modal-overlay fadeIn" style={{ zIndex: 100000 }}>
            <div className="modal-content" style={{ maxWidth: '400px', padding: 0, overflow: 'hidden', border: '3px solid #1d3d6e' }}>
                <div style={{ background: '#1d3d6e', padding: '1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShieldCheck size={24} />
                        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 900 }}>ADMIN AUTH</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ebf2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <Lock size={30} color="#1d3d6e" />
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Enter Restricted Access Secret</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <input
                                autoFocus
                                type="password"
                                placeholder="****************"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                style={{
                                    textAlign: 'center',
                                    fontSize: '1.5rem',
                                    letterSpacing: '5px',
                                    border: '2px solid #e2e8f0',
                                    padding: '1rem'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: '#1d3d6e',
                                fontSize: '1rem'
                            }}
                        >
                            UNLOCK CONSOLE <ChevronRight size={18} />
                        </button>
                    </form>

                    <p style={{ color: '#94a3b8', fontSize: '0.7rem', textAlign: 'center', marginTop: '1.5rem', fontWeight: 600 }}>
                        SYSTEM AUDIT IN PROGRESS &bull; ENCRYPTED SESSION
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLockModal;
