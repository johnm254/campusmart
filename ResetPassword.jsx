import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useApp } from '../AppContext';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
    const { addNotification, setCurrentPage } = useApp();
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get('token');
        const e = urlParams.get('email');
        if (t && e) {
            setToken(t);
            setEmail(e);
        } else {
            addNotification('Error', 'Invalid or missing reset link.', 'warning');
            setCurrentPage('home');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            addNotification('Error', 'Passwords do not match!', 'warning');
            return;
        }

        if (newPassword.length < 6) {
            addNotification('Error', 'Password must be at least 6 characters long.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const res = await api.resetPassword({
                email,
                token,
                newPassword
            });
            setSuccess(true);
            addNotification('Success', res.message, 'success');
            setTimeout(() => {
                setCurrentPage('home');
            }, 5000);
        } catch (error) {
            addNotification('Error', error.message, 'warning');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
                <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
                    <CheckCircle size={64} color="var(--jiji-green)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '2rem', color: 'var(--campus-blue)', marginBottom: '1rem' }}>Password Reset!</h2>
                    <p style={{ color: '#666', marginBottom: '2rem' }}>Your password has been successfully updated. You can now use your new password to sign in.</p>
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', maxWidth: '450px', width: '100%' }}>
                <h2 style={{ fontSize: '1.75rem', color: 'var(--campus-blue)', marginBottom: '0.5rem', textAlign: 'center' }}>Create New Password</h2>
                <p style={{ color: '#666', marginBottom: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>Choose a strong password for your account.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Lock size={16} /> New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                required
                                style={{ padding: '1rem', width: '100%', paddingRight: '3.5rem', borderRadius: '12px', border: '2px solid #eee' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Lock size={16} /> Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            style={{ padding: '1rem', width: '100%', borderRadius: '12px', border: '2px solid #eee' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderRadius: '12px', display: 'flex', gap: '10px' }}>
                    <AlertCircle size={20} color="#888" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.8rem', color: '#888', lineHeight: '1.4' }}>
                        Make sure your password is at least 6 characters long and includes a mix of letters and numbers for better security.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
