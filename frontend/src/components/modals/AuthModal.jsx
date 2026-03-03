import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useApp } from '../../AppContext';
import { X, Eye, EyeOff, Lock, Mail, User, Phone } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const { setUser, addNotification, showInfo } = useApp();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [signupStep, setSignupStep] = useState(1); // Multi-step signup

    // Reset form when modal closes/opens
    React.useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setFullName('');
            setPhoneNumber('');
            setConfirmPassword('');
            setAcceptTerms(false);
            setIsLogin(true);
            setIsForgot(false);
            setSignupStep(1);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNextStep = (e) => {
        e.preventDefault();
        
        // Validate Step 1
        if (password !== confirmPassword) {
            addNotification('Error', 'Passwords do not match!', 'warning');
            return;
        }
        if (password.length < 6) {
            addNotification('Error', 'Password must be at least 6 characters long', 'warning');
            return;
        }
        
        setSignupStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isForgot) {
            setLoading(true);
            try {
                const res = await api.forgotPassword(email);
                addNotification('Success', res.message, 'success');
                setIsForgot(false);
                setIsLogin(true);
            } catch (error) {
                addNotification('Error', error.message, 'warning');
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!isLogin && signupStep === 1) {
            handleNextStep(e);
            return;
        }

        if (!isLogin && signupStep === 2) {
            if (!acceptTerms) {
                addNotification('Error', 'Please accept the Privacy and Policy to continue.', 'warning');
                return;
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                const res = await api.login(email, password);
                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    setUser(res.user);
                    addNotification('Welcome back!', 'Successfully signed in.', 'success');
                    onClose();
                } else {
                    throw new Error(res.message || 'Login failed');
                }
            } else {
                const res = await api.signup({
                    full_name: fullName,
                    email,
                    password,
                    whatsapp: phoneNumber,
                    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=28a745&color=fff`
                });

                if (res.token) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                    setUser(res.user);
                    addNotification('Success!', 'Account created and signed in!', 'success');
                    onClose();
                } else {
                    throw new Error(res.message || 'Signup failed');
                }
            }
        } catch (error) {
            addNotification('Auth Error', error.message, 'warning');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setIsForgot(true);
        setIsLogin(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 500000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px', padding: '2.5rem' }}>
                <div className="modal-header" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: 'var(--campus-blue)' }}>
                        {isForgot ? 'Reset Password' : (isLogin ? 'Sign in' : signupStep === 1 ? 'Create Account' : 'Complete Profile')}
                    </h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>

                {/* Progress indicator for signup */}
                {!isLogin && !isForgot && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, height: '4px', backgroundColor: signupStep >= 1 ? 'var(--jiji-green)' : '#e0e0e0', borderRadius: '2px', transition: 'background-color 0.3s' }}></div>
                        <div style={{ flex: 1, height: '4px', backgroundColor: signupStep >= 2 ? 'var(--jiji-green)' : '#e0e0e0', borderRadius: '2px', transition: 'background-color 0.3s' }}></div>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {isForgot ? (
                        <div className="form-group">
                            <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                placeholder="yourname@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ padding: '0.8rem 1rem' }}
                            />
                        </div>
                    ) : (
                        <>
                            {/* SIGNUP STEP 1: Email & Password */}
                            {!isLogin && signupStep === 1 && (
                                <>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                        Step 1 of 2: Create your credentials
                                    </p>
                                    
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Mail size={16} /> Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="e.g. yourname@gmail.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            style={{ padding: '0.8rem 1rem' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Lock size={16} /> Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                style={{ padding: '0.8rem 1rem', width: '100%', paddingRight: '3rem' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <small style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px', display: 'block' }}>At least 6 characters</small>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Lock size={16} /> Confirm Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                autoComplete="new-password"
                                                placeholder="••••••••"
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                required
                                                style={{ padding: '0.8rem 1rem', width: '100%', paddingRight: '3rem' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* SIGNUP STEP 2: Profile Info */}
                            {!isLogin && signupStep === 2 && (
                                <>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                                        Step 2 of 2: Tell us about yourself
                                    </p>
                                    
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><User size={16} /> Full Name</label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            autoComplete="name"
                                            placeholder="e.g. Mary Blexy"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            required
                                            style={{ padding: '0.8rem 1rem' }}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Phone size={16} /> Phone Number</label>
                                        <input
                                            type="tel"
                                            id="whatsapp"
                                            name="whatsapp"
                                            autoComplete="tel"
                                            placeholder="e.g. 0712345678"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            required
                                            style={{ padding: '0.8rem 1rem' }}
                                        />
                                    </div>

                                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={e => setAcceptTerms(e.target.checked)}
                                            style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--jiji-green)' }}
                                        />
                                        <span>
                                            I accept the <button type="button" onClick={() => showInfo('Policy', 'Our policy ensures that all comrades can trade safely. We protect your data and expect honest listings.')} style={{ background: 'none', border: 'none', color: 'var(--jiji-green)', padding: 0, fontWeight: 700, cursor: 'pointer' }}>Privacy and Policy</button>
                                        </span>
                                    </label>
                                </>
                            )}

                            {/* LOGIN FORM */}
                            {isLogin && (
                                <>
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Mail size={16} /> Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="e.g. yourname@gmail.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            style={{ padding: '0.8rem 1rem' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}><Lock size={16} /> Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                                style={{ padding: '0.8rem 1rem', width: '100%', paddingRight: '3rem' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            style={{ background: 'none', border: 'none', color: 'var(--jiji-green)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '1rem' }}>
                        {!isLogin && signupStep === 2 && (
                            <button 
                                type="button" 
                                onClick={() => setSignupStep(1)}
                                className="btn"
                                style={{ flex: 1, padding: '1rem', fontSize: '1.05rem', backgroundColor: '#f0f0f0', color: '#333' }}
                            >
                                Back
                            </button>
                        )}
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '1rem', fontSize: '1.05rem' }} 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : (
                                isForgot ? 'Send Reset Link' : 
                                isLogin ? 'Login' : 
                                signupStep === 1 ? 'Next' : 
                                'Create Account'
                            )}
                        </button>
                    </div>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.9rem', marginTop: '2rem', borderTop: '1px solid #f0f0f0', paddingTop: '1.5rem' }}>
                    {isForgot ? (
                        <button
                            onClick={() => { setIsForgot(false); setIsLogin(true); }}
                            style={{ background: 'none', border: 'none', color: 'var(--jiji-green)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Back to Sign in
                        </button>
                    ) : (
                        <>
                            {isLogin ? "New to CampusMart? " : "Already have an account? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setSignupStep(1); }}
                                style={{ background: 'none', border: 'none', color: 'var(--jiji-green)', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                {isLogin ? 'Register now' : 'Sign in'}
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
