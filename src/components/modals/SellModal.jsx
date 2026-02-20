import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useApp } from '../../AppContext';
import { X, Camera, Plus, Trash2, Shield } from 'lucide-react';
import ImageCropperModal from '../ui/ImageCropperModal';

const SellModal = ({ isOpen, onClose }) => {
    const { user, addNotification } = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'electronics',
        price: '',
        condition: 'second-hand',
        description: '',
        location: 'Gate A',
        image_url: '', // Main image for backward compatibility
        images: []     // Array of images
    });

    const [tempImage, setTempImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    if (!isOpen) return null;

    // Determine photo limit based on boost plan
    const getPhotoLimit = () => {
        if (!user) return 1;
        if (user.boost_type === 'power') return 10;
        if (user.boost_type === 'starter') return 5;
        return 2; // Free users get 2
    };

    const photoLimit = getPhotoLimit();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (formData.images.length >= photoLimit) {
                addNotification('Limit Reached', `Your current plan allows up to ${photoLimit} photos. Upgrade to add more!`, 'warning');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setTempImage(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = (croppedImage) => {
        const newImages = [...formData.images, croppedImage];
        setFormData({
            ...formData,
            images: newImages,
            image_url: formData.image_url || croppedImage // Set first image as main
        });
        setShowCropper(false);
        setTempImage(null);
    };

    const removeImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            images: newImages,
            image_url: newImages.length > 0 ? newImages[0] : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            addNotification('Sign in required', 'Please sign in to list items.', 'warning');
            return;
        }

        const priceNum = parseInt(formData.price);
        if (isNaN(priceNum) || priceNum <= 0) {
            addNotification('Invalid Price', 'Please enter a valid price.', 'warning');
            return;
        }

        if (formData.images.length === 0) {
            addNotification('Image required', 'Please upload at least one photo.', 'warning');
            return;
        }

        setLoading(true);
        try {
            const res = await api.addProduct({
                title: formData.title,
                category: formData.category,
                price: priceNum,
                condition: formData.condition,
                description: formData.description,
                location: formData.location,
                image_url: formData.images[0], // Primary image
                images: JSON.stringify(formData.images), // All images
                seller_id: user.id
            });

            if (res.message !== 'Product added successfully') {
                throw new Error(res.message || 'Failed to add product');
            }

            addNotification('Success!', 'Your item is now live in the marketplace.', 'success');
            onClose();
            // Reset form
            setFormData({
                title: '',
                category: 'electronics',
                price: '',
                condition: 'second-hand',
                description: '',
                location: 'Gate A',
                image_url: '',
                images: []
            });
        } catch (error) {
            addNotification('Error listing item', error.message, 'warning');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === 'modal-overlay') {
            const isDirty = formData.title || formData.price || formData.images.length > 0;
            if (isDirty) {
                if (window.confirm('You have unsaved changes. Are you sure you want to exit?')) {
                    onClose();
                }
            } else {
                onClose();
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} style={{ zIndex: 400000 }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%', padding: 0, borderRadius: '24px' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderRadius: '24px 24px 0 0' }}>
                    <h2 style={{ fontSize: '1.5rem', color: 'var(--campus-blue)', fontWeight: 800 }}>Create New Listing</h2>
                    <button type="button" className="close-btn" onClick={() => {
                        const isDirty = formData.title || formData.price || formData.images.length > 0;
                        if (isDirty) {
                            if (window.confirm('Are you sure you want to discard this listing?')) onClose();
                        } else {
                            onClose();
                        }
                    }}><X /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2rem', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1.2fr', gap: '2rem' }} className="sell-modal-grid">
                        {/* Image Sector */}
                        <div>
                            <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '1rem' }}>
                                Photos ({formData.images.length}/{photoLimit})
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
                                {formData.images.map((img, index) => (
                                    <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(238, 28, 36, 0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                            <X size={12} />
                                        </button>
                                        {index === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,174,239,0.8)', color: 'white', fontSize: '0.6rem', textAlign: 'center', padding: '2px', fontWeight: 700 }}>MAIN</div>}
                                    </div>
                                ))}

                                {formData.images.length < photoLimit && (
                                    <div
                                        onClick={() => document.getElementById('product-image-input').click()}
                                        style={{
                                            aspectRatio: '1',
                                            background: '#f8fafc',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px dashed #cbd5e1',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.borderColor = 'var(--campus-blue)'}
                                        onMouseOut={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                                    >
                                        <Plus size={24} color="#94a3b8" />
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>Add</span>
                                    </div>
                                )}
                            </div>

                            <input type="file" id="product-image-input" hidden accept="image/*" onChange={handleFileChange} />

                            {user?.boost_type !== 'power' && (
                                <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #e0f2fe', marginTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                        <Shield size={18} color="#00aeef" style={{ marginTop: '2px' }} />
                                        <div>
                                            <p style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700, margin: 0 }}>Boost your listing!</p>
                                            <p style={{ fontSize: '0.75rem', color: '#0c4a6e', margin: '2px 0 0 0' }}>The Power Plan allows up to 10 high-quality photos and top placement.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details Sector */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Item Title</label>
                                <input
                                    type="text"
                                    placeholder="What are you selling?"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.95rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', background: 'white', marginTop: '0.25rem' }}
                                    >
                                        <option value="electronics">Electronics</option>
                                        <option value="books">Books</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="housing">Accommodation</option>
                                        <option value="outfit">Outfit</option>
                                        <option value="utensils">Utensils</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Price (KSh)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0' }}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Condition</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    {['new', 'refurbished', 'second-hand'].map(cond => (
                                        <button
                                            key={cond}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, condition: cond })}
                                            style={{
                                                flex: 1,
                                                padding: '0.6rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                background: formData.condition === cond ? 'var(--campus-blue)' : 'white',
                                                color: formData.condition === cond ? 'white' : '#64748b',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                textTransform: 'capitalize',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {cond.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Description</label>
                                <textarea
                                    placeholder="Provide more details about your item..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ padding: '0.8rem 1rem', minHeight: '100px', borderRadius: '12px', border: '2px solid #e2e8f0', resize: 'none' }}
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Preferred Pick-up Point</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Near Gate A, Student Center"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            marginTop: '2.5rem',
                            padding: '1.2rem',
                            fontSize: '1.1rem',
                            borderRadius: '16px',
                            background: 'var(--campus-blue)',
                            color: 'white',
                            border: 'none',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 10px 15px -3px rgba(29, 61, 110, 0.3)'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Posting Listing...' : 'Complete Listing'}
                    </button>
                </form>
            </div>

            {showCropper && (
                <ImageCropperModal
                    image={tempImage}
                    onCrop={handleCrop}
                    onClose={() => setShowCropper(false)}
                    aspectRatio={4 / 3}
                />
            )}
        </div>
    );
};

export default SellModal;
