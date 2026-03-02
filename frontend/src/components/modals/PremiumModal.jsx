import React, { useState } from 'react';
import { X, Check, Shield, Rocket, Zap, Star, Flame, Camera, ArrowRight, Bookmark, Phone, Loader2 } from 'lucide-react';
import { useApp } from '../../AppContext';
import { api } from '../../lib/api';

const PremiumModal = ({ isOpen, onClose }) => {
    const { user, addNotification } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedPlan, setSelectedPlan] = useState(null); // 'starter' or 'power'
    const [checkoutRequestId, setCheckoutRequestId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, pending, success, failed

    if (!isOpen) return null;

    const plans = [
        {
            id: 'starter',
            name: 'Starter Boost',
            price: 149,
            duration: 14,
            power: 'Medium',
            color: '#00aeef', // Blue
            icon: <Rocket size={24} />,
<<<<<<< HEAD
            badge: '🥉 Starter',
            features: [
                'Listing appears above free posts',
                'Highlighted blue badge (⭐ Boosted)',
=======
            badge: 'Starter',
            features: [
                'Listing appears above free posts',
                'Highlighted blue badge (Boosted)',
>>>>>>> teammate/main
                'Stays boosted for 14 days',
                'Up to 5 photos per listing',
                'Priority in search results'
            ]
        },
        {
            id: 'power',
            name: 'Power Boost',
            price: 220,
            duration: 28,
            power: 'High',
            color: '#FFD700', // Gold
            icon: <Zap size={24} />,
<<<<<<< HEAD
            badge: '🥈 Power',
=======
            badge: 'Power',
>>>>>>> teammate/main
            isPopular: false,
            features: [
                'EVERYTHING in Starter + extra power',
                'Top placement in category',
                '“🔥 Urgent Sale” badge',
                'Boost lasts 28 days',
                'Up to 10 photos per listing',
                'Featured on homepage',
                'Auto-repost once during boost'
            ]
        },
        {
            id: 'premium_verification',
            name: 'Premium Verification',
            price: 480,
            duration: 30,
            power: 'Supreme (15x Views)',
            color: '#1d3d6e', // Dark Blue
            icon: <Shield size={24} />,
            badge: '🥇 Premium',
            isPopular: true,
            features: [
                'EVERYTHING in Power + Verification',
                'Verified blue checkmark on profile',
                '15x accelerated views for all listings',
                'Exclusive "Verified Seller" badge',
                'Unrestricted photos per listing',
                'Direct premium support channel',
                'Trust signal for all buyers'
            ]
        }
    ];

    const pollPaymentStatus = (reqId) => {
        const interval = setInterval(async () => {
            try {
                const res = await api.checkMpesaStatus(reqId);
                if (res.status === 'completed') {
                    clearInterval(interval);
                    setPaymentStatus('success');
                    addNotification('Success', 'Payment verified! Your account is now boosted.', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else if (res.status === 'failed') {
                    clearInterval(interval);
                    setPaymentStatus('failed');
                    addNotification('Error', 'Payment failed or cancelled.', 'error');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 3000);

        // Stop polling after 2 minutes
        setTimeout(() => {
            clearInterval(interval);
            if (paymentStatus === 'pending') {
                setPaymentStatus('failed');
                setIsLoading(false);
                addNotification('Timeout', 'Payment verification timed out. If you paid, contact support.', 'warning');
            }
        }, 120000);
    };

    const handleSubscribe = async () => {
        if (!phoneNumber) {
            addNotification('Error', 'Please enter your M-Pesa phone number.', 'error');
            return;
        }

        if (!selectedPlan) {
            addNotification('Error', 'Please select a boost package.', 'error');
            return;
        }

        const planData = plans.find(p => p.id === selectedPlan);

        let formattedPhone = phoneNumber.replace(/\s+/g, '');
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.substring(1);
        } else if (formattedPhone.startsWith('+254')) {
            formattedPhone = formattedPhone.substring(1);
        }

        const phoneRegex = /^254([71])\d{8}$/;
        if (!phoneRegex.test(formattedPhone)) {
            addNotification('Error', 'Please enter a valid M-Pesa number.', 'error');
            return;
        }

        setIsLoading(true);
        setPaymentStatus('pending');

        try {
            const stkRes = await api.initiateMpesaPayment({
                amount: planData.price,
                phone: formattedPhone,
                plan: selectedPlan
            });

            if (stkRes.checkoutRequestID) {
                setCheckoutRequestId(stkRes.checkoutRequestID);
                addNotification('Info', 'STK Push sent! Please enter your PIN.', 'info');
                pollPaymentStatus(stkRes.checkoutRequestID);
            } else {
                addNotification('Error', stkRes.message || 'Failed to initiate payment.', 'error');
                setIsLoading(false);
                setPaymentStatus('failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            addNotification('Error', 'Payment processing failed.', 'error');
            setIsLoading(false);
            setPaymentStatus('failed');
        }
    };

    const handleSimulateSuccess = async () => {
        if (!checkoutRequestId) return;
        try {
            await api.simulateMpesaSuccess(checkoutRequestId);
            // The polling should pick it up in the next iteration
        } catch (err) {
            addNotification('Error', 'Simulation failed.', 'error');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 450000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                maxWidth: '600px',
                width: '95%',
                padding: 0,
                borderRadius: '30px',
                maxHeight: '95vh',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1d3d6e 0%, #00aeef 100%)', padding: '2.5rem 2rem', color: 'white', textAlign: 'center', position: 'relative' }}>
                        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                            <X size={20} />
                        </button>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Upgrade Your Listing</h2>
                        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>Choose a package that fits your goal</p>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        {selectedPlan === null ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                                {plans.map(plan => (
                                    <div
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        style={{
                                            background: 'white',
                                            borderRadius: '24px',
                                            padding: '1.5rem',
                                            border: `2px solid ${plan.isPopular ? plan.color : '#e2e8f0'}`,
                                            position: 'relative',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            transform: 'translateY(0)',
                                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)';
                                        }}
                                    >
                                        {plan.isPopular && (
                                            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: plan.color, color: '#1d3d6e', fontSize: '0.75rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                                MOST POPULAR
                                            </div>
                                        )}
                                        <div style={{ color: plan.color, marginBottom: '1rem' }}>{plan.icon}</div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{plan.name}</h3>
                                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1d3d6e', margin: '0.5rem 0' }}>
                                            KSh {plan.price}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Zap size={14} /> Power Level: <strong>{plan.power}</strong>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {plan.features.map((feature, i) => (
                                                <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
                                                    <Check size={16} style={{ color: plan.color, flexShrink: 0 }} />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button style={{
                                            width: '100%',
                                            marginTop: '2rem',
                                            background: plan.id === 'power' ? '#FFD700' : '#00aeef',
                                            color: plan.id === 'power' ? '#1d3d6e' : 'white',
                                            border: 'none',
                                            padding: '0.8rem',
                                            borderRadius: '12px',
                                            fontWeight: 800,
                                            cursor: 'pointer'
                                        }}>
                                            Select Plan
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <button
                                    onClick={() => setSelectedPlan(null)}
                                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 600 }}
                                >
                                    <ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /> Back to plans
                                </button>

                                <div style={{ background: 'white', borderRadius: '24px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                    {paymentStatus === 'pending' ? (
                                        <div style={{ textAlign: 'center', padding: '1rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                                <div style={{ position: 'relative' }}>
                                                    <Loader2 size={60} color={plans.find(p => p.id === selectedPlan).color} className="spin" />
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Phone size={24} color={plans.find(p => p.id === selectedPlan).color} />
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Waiting for Payment...</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
                                                Please check your phone and enter your M-Pesa PIN for <strong>KSh {plans.find(p => p.id === selectedPlan).price}</strong>.
                                            </p>

                                            {/* Dev Simulation Button */}
                                            <button
                                                onClick={handleSimulateSuccess}
                                                style={{ background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#64748b', padding: '0.75rem', borderRadius: '12px', fontSize: '0.75rem', cursor: 'pointer', width: '100%', fontWeight: 600 }}
                                            >
                                                I have paid (Developer Test)
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                                                    Activating {plans.find(p => p.id === selectedPlan).name}
                                                </h3>
                                                <div style={{ fontSize: '1.25rem', color: '#1d3d6e', fontWeight: 700 }}>
                                                    Total: KSh {plans.find(p => p.id === selectedPlan).price}
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '1.5rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>M-Pesa Number</label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g., 2547XXXXXXXX"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        style={{
                                                            width: '100%',
                                                            padding: '1rem 1rem 1rem 3rem',
                                                            borderRadius: '16px',
                                                            border: '2px solid #e2e8f0',
                                                            fontSize: '1rem',
                                                            outline: 'none'
                                                        }}
                                                    />
                                                    <Phone size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleSubscribe}
                                                disabled={isLoading}
                                                style={{
                                                    width: '100%',
                                                    background: plans.find(p => p.id === selectedPlan).color,
                                                    color: selectedPlan === 'power' ? '#1d3d6e' : 'white',
                                                    border: 'none',
                                                    padding: '1.2rem',
                                                    borderRadius: '16px',
                                                    fontWeight: 800,
                                                    fontSize: '1.1rem',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                                    opacity: isLoading ? 0.7 : 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.75rem'
                                                }}
                                            >
                                                {isLoading ? <Loader2 className="spin" /> : <Rocket size={20} />}
                                                Pay KSh {plans.find(p => p.id === selectedPlan).price} & Activate
                                            </button>
                                        </>
                                    )}
                                </div>
                                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1.5rem' }}>
                                    Secure payment powered by M-Pesa.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .spin { animation: spin 1s linear infinite; }
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    ` }} />
            </div>
        </div>
    );
};

export default PremiumModal;
