import React, { useState, useEffect } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../AppContext';
import { api } from '../../lib/api';

const UserReviewModal = ({ isOpen, onClose, revieweeId, revieweeName, parentId = null, onReviewSubmitted }) => {
    const { user, addNotification } = useApp();
    const [step, setStep] = useState('form');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('form');
                setComment('');
                setRating(0);
            }, 300);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (isSubmitting) return;

        console.log('--- Review Submission Started ---');
        console.log('Reviewee ID:', revieweeId);
        console.log('Reviewee Name:', revieweeName);
        console.log('Rating:', rating);
        console.log('Comment:', comment);
        console.log('Current User:', user?.id);

        if (!user) {
            addNotification('Error', 'You must be logged in to post a review.', 'warning');
            return;
        }

        if (!revieweeId) {
            addNotification('Error', 'Seller information is missing. Try refreshing.', 'error');
            return;
        }

        if (rating === 0) {
            addNotification('Wait!', 'Please select a rating star.', 'warning');
            return;
        }

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                addNotification('Error', 'Your session has expired. Please log in again.', 'error');
                setIsSubmitting(false);
                return;
            }

            // Direct fetch to be 100% sure the payload and headers are right
            const payload = {
                reviewee_id: parseInt(revieweeId),
                rating: parseInt(rating),
                comment: comment || '',
                parent_id: parentId
            };
            console.log('Sending Review Payload:', payload);

            const response = await fetch(`${api.baseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const res = await response.json();
            console.log('Direct API response:', res);

            if (response.ok || (res && res.message && res.message.toLowerCase().includes('success'))) {
                console.log('Submission confirmed successful');
                setStep('success');
                addNotification('Success!', res.message || 'Review posted successfully', 'success');
                if (onReviewSubmitted) {
                    try { onReviewSubmitted(); } catch (e) { console.error('Callback failed:', e); }
                }
            } else {
                throw new Error(res.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Critical Review Error:', error);
            addNotification('Error', error.message || 'Connection failed. Is the server running?', 'error');
        } finally {
            setIsSubmitting(false);
            console.log('--- Review Submission Ended ---');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 350000, // Even higher
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(10px)'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    background: 'white',
                    borderRadius: '28px',
                    boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)',
                    overflow: 'hidden',
                    animation: 'modalFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
            >
                <style>{`
                    @keyframes modalFadeUp {
                        from { opacity: 0; transform: translateY(20px) scale(0.98); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}</style>

                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1d3d6e 0%, #0f172a 100%)',
                    color: 'white',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{parentId ? `Reply to ${revieweeName}` : `Review ${revieweeName}`}</h3>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', opacity: 0.8 }}>{parentId ? 'Share your thoughts on this review' : 'Help other students by sharing your experience'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '2rem' }}>
                    {step === 'form' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Rating */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.1s' }}
                                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            <Star
                                                size={40}
                                                fill={(hoverRating || rating) >= star ? "#FFD700" : "none"}
                                                color={(hoverRating || rating) >= star ? "#FFD700" : "#e2e8f0"}
                                                strokeWidth={(hoverRating || rating) >= star ? 0 : 2}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div style={{ minHeight: '1.5rem' }}>
                                    {rating > 0 && (
                                        <span style={{
                                            fontSize: '0.85rem',
                                            fontWeight: 900,
                                            color: '#b8860b',
                                            background: '#fff9e6',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '20px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {['Awful', 'Poor', 'Good', 'Great!', 'Excellent!'][rating - 1]}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Comment */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: '0.75rem' }}>
                                    {parentId ? 'Your Reply' : 'Tell us more (Optional)'}
                                </label>
                                <textarea
                                    placeholder={parentId ? "Write your comment on this review..." : "What was it like dealing with this trader?"}
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    style={{
                                        width: '100%',
                                        height: '120px',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        outline: 'none',
                                        resize: 'none',
                                        fontSize: '0.95rem',
                                        background: '#f8fafc',
                                        lineHeight: '1.6',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={e => {
                                        e.currentTarget.style.borderColor = '#1d3d6e';
                                        e.currentTarget.style.background = '#fff';
                                        e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 61, 110, 0.05)';
                                    }}
                                    onBlur={e => {
                                        e.currentTarget.style.borderColor = '#f1f5f9';
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #1d3d6e 0%, #1e40af 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1.1rem',
                                    borderRadius: '16px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    boxShadow: isSubmitting ? 'none' : '0 10px 25px -5px rgba(29, 61, 110, 0.3)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseOver={e => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                onMouseOut={e => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                        Submitting...
                                    </>
                                ) : 'Post My Review'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            <div style={{
                                width: '90px',
                                height: '90px',
                                background: '#f0fff4',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                color: '#38a169',
                                boxShadow: 'inset 0 0 0 2px #c6f6d5'
                            }}>
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Review Published!</h2>
                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                                Your feedback has been shared with the community. Thank you for contributing to CampusMart's trust and safety.
                            </p>
                            <button
                                onClick={onClose}
                                style={{
                                    background: '#1d3d6e',
                                    color: 'white',
                                    padding: '1rem 2.5rem',
                                    borderRadius: '14px',
                                    border: 'none',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseOut={e => e.currentTarget.style.opacity = '1'}
                            >
                                Back to Product
                            </button>
                        </div>
                    )}
                </div>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default UserReviewModal;
