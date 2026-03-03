import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useApp } from '../../AppContext';
import { X, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

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
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ 
                maxWidth: '500px', 
                padding: '0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
                {/* Header Section */}
                <div style={{ 
                    background: 'linear-gradient(135deg, var(--campus-blue) 0%, #1a5490 100%)',
                    padding: '2rem 2.5rem',
                    color: 'white',
                    position: 'relative'
                }}>
                    <button 
                        className="close-btn" 
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.3)'}
                        onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                    >
                        <X size={20} />
                    </button>

                    <div style={{ marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.85rem', fontWeight: '700', margin: 0, marginBottom: '0.5rem' }}>
                            {isForgot ? 'Reset Password' : (isLogin ? 'Welcome Back!' : signupStep === 1 ? 'Join CampusMart' : 'Almost There!')}
                        </h2>
                        <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: 0 }}>
                            {isForgot ? 'We\'ll help you recover your account' : 
                             isLogin ? 'Sign in to continue your journey' : 
                             signupStep === 1 ? 'Create your account in 2 easy steps' : 
                             'Complete your profile to get started'}
                        </p>
                    </div>

                    {/* Progress indicator for signup */}
                    {!isLogin && !isForgot && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    flex: 1
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: signupStep >= 1 ? 'white' : 'rgba(255,255,255,0.3)',
                                        color: signupStep >= 1 ? 'var(--campus-blue)' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s'
                                    }}>
                                        {signupStep > 1 ? <CheckCircle size={18} /> : '1'}
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: signupStep === 1 ? '600' : '400', opacity: signupStep === 1 ? 1 : 0.8 }}>
                                        Credentials
                                    </span>
                                </div>
                                
                                <div style={{ 
                                    flex: 1, 
                                    height: '3px', 
                                    background: signupStep >= 2 ? 'white' : 'rgba(255,255,255,0.3)',
                                    borderRadius: '2px',
                                    transition: 'all 0.3s'
                                }}></div>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    flex: 1
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: signupStep >= 2 ? 'white' : 'rgba(255,255,255,0.3)',
                                        color: signupStep >= 2 ? 'var(--campus-blue)' : 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s'
                                    }}>
                                        2
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: signupStep === 2 ? '600' : '400', opacity: signupStep === 2 ? 1 : 0.8 }}>
                                        Profile
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Section */}
                <div style={{ padding: '2.5rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isForgot ? (
                        <div className="form-group">
                            <div style={{ 
                                background: '#f8f9fa', 
                                padding: '1rem', 
                                borderRadius: '8px', 
                                marginBottom: '1.5rem',
                                border: '1px solid #e9ecef'
                            }}>
                                <p style={{ fontSize: '0.9rem', color: '#495057', margin: 0, lineHeight: '1.5' }}>
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>
                            <label style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px', 
                                marginBottom: '10px', 
                                fontSize: '0.9rem', 
                                fontWeight: 600,
                                color: '#2c3e50'
                            }}>
                                <Mail size={16} color="var(--campus-blue)" /> Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="yourname@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ 
                                    padding: '0.9rem 1rem',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                                onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                onBlur={e => e.target.style.borderColor = '#e9ecef'}
                            />
                        </div>
                    ) : (
                        <>
                            {/* SIGNUP STEP 1: Email & Password */}
                            {!isLogin && signupStep === 1 && (
                                <>
                                    <div style={{ 
                                        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', 
                                        padding: '1rem 1.25rem', 
                                        borderRadius: '10px',
                                        border: '1px solid #c8e6c9',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <p style={{ fontSize: '0.9rem', color: '#2e7d32', margin: 0, fontWeight: 500 }}>
                                            🔐 Step 1: Set up your login credentials
                                        </p>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '10px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 600,
                                            color: '#2c3e50'
                                        }}>
                                            <Mail size={16} color="var(--campus-blue)" /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="e.g. yourname@gmail.com"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            style={{ 
                                                padding: '0.9rem 1rem',
                                                border: '2px solid #e9ecef',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                            onBlur={e => e.target.style.borderColor = '#e9ecef'}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '10px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 600,
                                            color: '#2c3e50'
                                        }}>
                                            <Lock size={16} color="var(--campus-blue)" /> Password
                                        </label>
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
                                                style={{ 
                                                    padding: '0.9rem 1rem',
                                                    paddingRight: '3rem',
                                                    width: '100%',
                                                    border: '2px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                                onBlur={e => e.target.style.borderColor = '#e9ecef'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    right: '12px', 
                                                    top: '50%', 
                                                    transform: 'translateY(-50%)', 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: '#6c757d', 
                                                    cursor: 'pointer', 
                                                    padding: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        <small style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '6px', display: 'block' }}>
                                            Minimum 6 characters
                                        </small>
                                    </div>

                                    <div className="form-group">
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '10px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 600,
                                            color: '#2c3e50'
                                        }}>
                                            <Lock size={16} color="var(--campus-blue)" /> Confirm Password
                                        </label>
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
                                                style={{ 
                                                    padding: '0.9rem 1rem',
                                                    paddingRight: '3rem',
                                                    width: '100%',
                                                    border: '2px solid #e9ecef',
                                                    borderRadius: '8px',
                                                    fontSize: '0.95rem',
                                                    transition: 'all 0.2s'
                                                }}
                                                onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                                onBlur={e => e.target.style.borderColor = '#e9ecef'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ 
                                                    position: 'absolute', 
                                                    right: '12px', 
                                                    top: '50%', 
                                                    transform: 'translateY(-50%)', 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: '#6c757d', 
                                                    cursor: 'pointer', 
                                                    padding: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
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
                                    <div style={{ 
                                        background: 'linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%)', 
                                        padding: '1rem 1.25rem', 
                                        borderRadius: '10px',
                                        border: '1px solid #b3e5fc',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <p style={{ fontSize: '0.9rem', color: '#01579b', margin: 0, fontWeight: 500 }}>
                                            👤 Step 2: Tell us about yourself
                                        </p>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '10px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 600,
                                            color: '#2c3e50'
                                        }}>
                                            <User size={16} color="var(--campus-blue)" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="full_name"
                                            name="full_name"
                                            autoComplete="name"
                                            placeholder="e.g. Mary Blexy"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            required
                                            style={{ 
                                                padding: '0.9rem 1rem',
                                                border: '2px solid #e9ecef',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                            onBlur={e => e.target.style.borderColor = '#e9ecef'}
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            marginBottom: '10px', 
                                            fontSize: '0.9rem', 
                                            fontWeight: 600,
                                            color: '#2c3e50'
                                        }}>
                                            <Phone size={16} color="var(--campus-blue)" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="whatsapp"
                                            name="whatsapp"
                                            autoComplete="tel"
                                            placeholder="e.g. 0712345678"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            required
                                            style={{ 
                                                padding: '0.9rem 1rem',
                                                border: '2px solid #e9ecef',
                                                borderRadius: '8px',
                                                fontSize: '0.95rem',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={e => e.target.style.borderColor = 'var(--campus-blue)'}
                                            onBlur={e => e.target.style.borderColor = '#e9ecef'}
                                        />
                                        <small style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '6px', display: 'block' }}>
                                            We'll use this for order updates
                                        </small>
                                    </div>

                                    <label style={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start', 
                                        gap: '12px', 
                                        fontSize: '0.9rem', 
                                        cursor: 'pointer', 
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '2px solid #e9ecef',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--jiji-green)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#e9ecef'}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={e => setAcceptTerms(e.target.checked)}
                                            style={{ 
                                                marginTop: '2px', 
                                                width: '18px', 
                                                height: '18px', 
                                                accentColor: 'var(--jiji-green)',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{ lineHeight: '1.5', color: '#495057' }}>
                                            I accept the <button 
                                                type="button" 
                                                onClick={() => showInfo('Policy', 'Our policy ensures that all comrades can trade safely. We protect your data and expect honest listings.')} 
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    color: 'var(--jiji-green)', 
                                                    padding: 0, 
                                                    fontWeight: 700, 
                                                    cursor: 'pointer',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Privacy and Policy
                                            </button>
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
                                onClick={() => setIsLogin(!isLogin)}
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
