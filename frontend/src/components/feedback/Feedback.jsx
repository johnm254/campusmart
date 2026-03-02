import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Star, CheckCircle2, ThumbsUp, AlertCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../../AppContext';
import { api } from '../../lib/api';

const Feedback = () => {
    const { user, addNotification, setIsAuthModalOpen } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState('form'); // 'form' or 'success'
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [type, setType] = useState('general');

    // Reset state when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('form');
                setContent('');
                setRating(0);
                setType('general');
            }, 300);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (rating === 0) {
            addNotification('Wait!', 'Please select a rating star.', 'warning');
            return;
        }

        if (!content.trim()) {
            addNotification('Wait!', 'Please write your feedback message.', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const feedbackText = `[${type.toUpperCase()}] Rating: ${rating}/5\n${'⭐'.repeat(rating)}\n\nMessage: ${content}`;
            const res = await api.sendFeedback(feedbackText);

            if (res.message === 'Feedback submitted successfully') {
                setStep('success');
                addNotification('Sent!', 'Feedback delivered to admin.', 'success');
            } else {
                addNotification('Error', res.message || 'Failed to send feedback', 'error');
            }
        } catch (error) {
            addNotification('Error', 'Connection failed. Try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const types = [
        { id: 'general', label: 'General', icon: MessageCircle },
        { id: 'bug', label: 'Report Bug', icon: AlertCircle },
        { id: 'feature', label: 'Suggestion', icon: ThumbsUp }
    ];

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 5000 }}>
            {isOpen ? (
                <div style={{
                    width: '360px',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    animation: 'slideUp 0.3s ease-out',
                    maxHeight: '80vh'
                }}>
                    <style>{`
                        @keyframes slideUp {
                            from { opacity: 0; transform: translateY(20px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}</style>

                    {/* Header */}
                    <div style={{
                        background: '#1d3d6e',
                        color: 'white',
                        padding: '1.25rem 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Feedback Center</h3>
                            <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', opacity: 0.7 }}>Share your thoughts with us</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                        {step === 'form' ? (
                            <form onSubmit={handleSubmit}>
                                {/* Category */}
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                    {types.map(t => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setType(t.id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem 0.4rem',
                                                borderRadius: '12px',
                                                border: '1px solid',
                                                borderColor: type === t.id ? '#1d3d6e' : '#e2e8f0',
                                                background: type === t.id ? '#1d3d6e' : 'white',
                                                color: type === t.id ? 'white' : '#64748b',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.4rem',
                                                transition: '0.2s'
                                            }}
                                        >
                                            <t.icon size={16} />
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Rating */}
                                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                onClick={() => setRating(star)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
                                            >
                                                <Star
                                                    size={28}
                                                    fill={(hoverRating || rating) >= star ? "#FFD700" : "none"}
                                                    color={(hoverRating || rating) >= star ? "#FFD700" : "#cbd5e0"}
                                                    style={{ transition: '0.1s' }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {rating > 0 && (
                                        <p style={{ fontSize: '11px', fontWeight: 800, color: '#FFD700', marginTop: '0.4rem', textTransform: 'uppercase' }}>
                                            {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating - 1]}
                                        </p>
                                    )}
                                </div>

                                {/* Textarea */}
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <textarea
                                        placeholder="Write your feedback here..."
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        style={{
                                            width: '100%',
                                            height: '110px',
                                            border: '1.5px solid #e2e8f0',
                                            borderRadius: '14px',
                                            padding: '0.85rem',
                                            outline: 'none',
                                            resize: 'none',
                                            fontSize: '0.9rem',
                                            background: '#f8fafc',
                                            lineHeight: '1.4',
                                            transition: '0.2s'
                                        }}
                                        onFocus={e => {
                                            e.currentTarget.style.borderColor = '#1d3d6e';
                                            e.currentTarget.style.background = '#fff';
                                        }}
                                        onBlur={e => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.background = '#f8fafc';
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        width: '100%',
                                        background: isSubmitting ? '#94a3b8' : '#1d3d6e',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.9rem',
                                        borderRadius: '12px',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 800,
                                        fontSize: '0.95rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: '#f0fff4',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem',
                                    color: '#38a169'
                                }}>
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1a202c', marginBottom: '0.75rem' }}>Thank You!</h2>
                                <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                                    Your input helps us make CampusMart better for everyone.
                                </p>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: '#1d3d6e',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '10px',
                                        border: 'none',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        background: '#1d3d6e',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(29, 61, 110, 0.3)',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.background = '#1a3a5f';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = '#1d3d6e';
                    }}
                >
                    <MessageSquare size={24} />
                    <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-5px',
                        background: '#ee1c24',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        border: '2px solid white'
                    }}>
                        FEEDBACK
                    </span>
                </div>
            )}
        </div>
    );
};

export default Feedback;
