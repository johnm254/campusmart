import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useApp } from '../../AppContext';
import { X, Camera, Plus, Trash2, Shield, Home, Clock, DoorOpen, MapPin, ShieldCheck, Phone, Check, Users, Building2, Bed, Star } from 'lucide-react';
import ImageCropperModal from '../ui/ImageCropperModal';

// ── Housing Catalog Definitions ───────────────────────────────────
const HOUSE_CATALOG = [
    {
        id: 'Hostel',
        emoji: '🏫',
        label: 'Hostel',
        badge: 'Shared',
        badgeColor: '#f97316',
        color: '#fff7ed',
        border: '#fed7aa',
        accentColor: '#ea580c',
        description: 'Dormitory-style with shared rooms, beds & common areas',
        facility_type: 'shared',
        room_count: 'Dormitory (Multiple Beds)',
        suggested_amenities: ['Water 24/7', 'Secure Fence', 'Near Main Road'],
        description_hint: 'Shared hostel with communal bathrooms, kitchen and common rooms. Great for first-year students.'
    },
    {
        id: 'Apartment',
        emoji: '🏢',
        label: 'Apartment',
        badge: 'Private',
        badgeColor: '#8b5cf6',
        color: '#faf5ff',
        border: '#ddd6fe',
        accentColor: '#7c3aed',
        description: 'Full self-contained apartment with multiple rooms',
        facility_type: 'private',
        room_count: '2+ Rooms',
        suggested_amenities: ['Free WiFi', 'Water 24/7', 'Tokens Electricity', 'Tiles Floors', 'In-built Wardrobe', 'Balcony'],
        description_hint: 'Fully furnished apartment. Includes living room, bedroom(s), kitchen and private bathroom.'
    },
    {
        id: 'Single Room',
        emoji: '🚪',
        label: 'Single Room',
        badge: 'Private',
        badgeColor: '#10b981',
        color: '#f0fdf4',
        border: '#bbf7d0',
        accentColor: '#059669',
        description: 'One private room, usually with shared bathroom',
        facility_type: 'private',
        room_count: '1 Room',
        suggested_amenities: ['Water 24/7', 'Secure Fence', 'Tokens Electricity'],
        description_hint: 'Single self-contained room. Bathroom may be shared or private depending on unit.'
    },
    {
        id: '1 Bedroom',
        emoji: '🛏️',
        label: '1 Bedroom',
        badge: 'Private',
        badgeColor: '#3b82f6',
        color: '#eff6ff',
        border: '#bfdbfe',
        accentColor: '#2563eb',
        description: 'Bedroom + separate sitting room + private bathroom',
        facility_type: 'private',
        room_count: '1 Bedroom + Sitting Room',
        suggested_amenities: ['Free WiFi', 'Water 24/7', 'Tiles Floors', 'In-built Wardrobe', 'Tokens Electricity'],
        description_hint: 'Spacious 1-bedroom unit with a sitting room, kitchen and private bathroom.'
    },
    {
        id: 'Bed-sitter',
        emoji: '🛋️',
        label: 'Bed-sitter',
        badge: 'Private',
        badgeColor: '#ec4899',
        color: '#fdf2f8',
        border: '#fbcfe8',
        accentColor: '#db2777',
        description: 'Combined bedroom & living space, private bathroom & kitchen',
        facility_type: 'private',
        room_count: '1 Room (Combined)',
        suggested_amenities: ['Water 24/7', 'Tokens Electricity', 'Tiles Floors'],
        description_hint: 'Bed-sitter with a combined sleeping and living area. Includes private kitchen and bathroom.'
    },
    {
        id: 'Studio',
        emoji: '🏠',
        label: 'Studio',
        badge: 'Modern',
        badgeColor: '#0ea5e9',
        color: '#f0f9ff',
        border: '#bae6fd',
        accentColor: '#0284c7',
        description: 'Open-plan modern studio apartment fully furnished',
        facility_type: 'private',
        room_count: 'Open Studio',
        suggested_amenities: ['Free WiFi', 'Water 24/7', 'Tokens Electricity', 'Tiles Floors', 'In-built Wardrobe', 'Balcony'],
        description_hint: 'Modern open-plan studio with a kitchenette, bathroom and sleeping area all in one elegant space.'
    },
    {
        id: 'Shared Room',
        emoji: '👥',
        label: 'Shared Room',
        badge: 'Shared',
        badgeColor: '#64748b',
        color: '#f8fafc',
        border: '#e2e8f0',
        accentColor: '#475569',
        description: 'Share a room with 1–3 other students, very affordable',
        facility_type: 'shared',
        room_count: '1 Shared Room (2-4 Occupants)',
        suggested_amenities: ['Water 24/7', 'Secure Fence', 'Near Main Road'],
        description_hint: 'Shared room for 2-4 students. Common bathrooms and kitchen. Budget-friendly option.'
    }
];


const SellModal = ({ isOpen, onClose }) => {
    const { user, addNotification, currentPage } = useApp();
    const [loading, setLoading] = useState(false);
    const [locationUploaded, setLocationUploaded] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'electronics',
        price: '',
        condition: 'second-hand',
        description: '',
        location: 'Gate A',
        latitude: '',
        longitude: '',
        distance: '',
        vacancy: '1',
        landmarks: '',    // Added for specific location
        facility_type: 'private', // Added for housing (shared vs private)
        room_count: '1',   // Added for housing
        amenities: [],
        contact_phone: '', // Added for housing
        security_features: '', // Added for housing
        image_url: '',
        images: []
    });

    const [tempImage, setTempImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    // Auto-select housing category if on accommodation page
    useEffect(() => {
        if (isOpen && currentPage === 'accommodation') {
            setFormData(prev => ({ ...prev, category: 'housing' }));
        }
    }, [isOpen, currentPage]);

    if (!isOpen) return null;

    // Everyone gets 5 photos — platform is fully free
    const photoLimit = 5;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (formData.images.length >= photoLimit) {
                addNotification('Limit Reached', `You can upload up to ${photoLimit} photos per listing.`, 'warning');
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
                seller_id: user.id,
                latitude: (formData.latitude && !isNaN(parseFloat(formData.latitude))) ? parseFloat(formData.latitude) : null,
                longitude: (formData.longitude && !isNaN(parseFloat(formData.longitude))) ? parseFloat(formData.longitude) : null,
                metadata: formData.category === 'housing' ? JSON.stringify({
                    amenities: formData.amenities,
                    distance: formData.distance,
                    vacancy: formData.vacancy,
                    landmarks: formData.landmarks,
                    facility_type: formData.facility_type,
                    room_count: formData.room_count
                }) : null,
                contact_phone: formData.contact_phone || null,
                security_features: formData.security_features || null
            });

            if (res.message !== 'Product added successfully') {
                throw new Error(res.message || 'Failed to add product');
            }

            addNotification('Success!', 'Your item is now live in the marketplace.', 'success');
            onClose();
            // Reset form
            setLocationUploaded(false);
            setLocationLoading(false);
            setFormData({
                title: '',
                category: 'electronics',
                price: '',
                condition: 'second-hand',
                description: '',
                location: 'Gate A',
                latitude: '',
                longitude: '',
                distance: '',
                vacancy: '1',
                landmarks: '',
                facility_type: 'private',
                room_count: '1',
                amenities: [],
                contact_phone: '',
                security_features: '',
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
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
                maxWidth: '800px',
                width: '95%',
                padding: 0,
                borderRadius: '24px',
                border: formData.category === 'housing' ? '2px solid var(--jiji-green)' : 'none'
            }}>
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: formData.category === 'housing' ? 'linear-gradient(135deg, #ffffff 0%, #f0fff4 100%)' : 'white',
                    borderRadius: '24px 24px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {formData.category === 'housing' && <Home color="var(--jiji-green)" size={28} />}
                        <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--campus-blue)', fontWeight: 800, margin: 0 }}>
                                {formData.category === 'housing' ? 'Post New House / Hostel' : 'Create New Listing'}
                            </h2>
                            {formData.category === 'housing' && (
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--jiji-green)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Property Manager Dashboard
                                </span>
                            )}
                        </div>
                    </div>
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

                            <div style={{ background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #bbf7d0', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={16} color="#059669" />
                                <p style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, margin: 0 }}>Up to 5 photos — completely free for everyone 🎉</p>
                            </div>
                        </div>

                        {/* Details Sector */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Item Title</label>
                                <input
                                    type="text"
                                    placeholder={formData.category === 'housing' ? "Catchy Title: e.g. Cozy Single Room in Westlands" : "What are you selling?"}
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
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                        {formData.category === 'housing' ? 'Rent (pm @ KSh)' : 'Price (KSh)'}
                                    </label>
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

                            {/* Housing Specific Details: Distance & Vacancy */}
                            {formData.category === 'housing' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={14} /> Distance to Campus
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 5 mins walk"
                                            value={formData.distance}
                                            onChange={e => setFormData({ ...formData, distance: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <DoorOpen size={14} /> Vacant Units
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="1"
                                            value={formData.vacancy}
                                            onChange={e => setFormData({ ...formData, vacancy: e.target.value })}
                                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '0.25rem' }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* ── CATALOG ───────────────────────────────────────────── */}
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {formData.category === 'housing' ? (
                                        <><Building2 size={16} color="var(--campus-blue)" /> Select House Type<span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>— auto-fills details</span></>
                                    ) : 'Condition'}
                                </label>

                                {formData.category === 'housing' ? (
                                    <>
                                        {/* Rich visual catalog grid */}
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '0.5rem' }}>
                                            {HOUSE_CATALOG.map(cat => {
                                                const isSelected = formData.condition === cat.id;
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                condition: cat.id,
                                                                facility_type: cat.facility_type,
                                                                room_count: cat.room_count,
                                                                amenities: cat.suggested_amenities,
                                                                description: prev.description || cat.description_hint
                                                            }));
                                                        }}
                                                        style={{
                                                            position: 'relative',
                                                            padding: '1rem',
                                                            borderRadius: '14px',
                                                            border: isSelected ? `2px solid ${cat.accentColor}` : `1.5px solid ${cat.border}`,
                                                            background: isSelected ? cat.color : 'white',
                                                            cursor: 'pointer',
                                                            textAlign: 'left',
                                                            transition: 'all 0.2s',
                                                            boxShadow: isSelected ? `0 4px 14px ${cat.accentColor}30` : '0 1px 3px rgba(0,0,0,0.06)'
                                                        }}
                                                    >
                                                        {/* Checkmark */}
                                                        {isSelected && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '0.5rem',
                                                                right: '0.5rem',
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                background: cat.accentColor,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                                <Check size={12} color="white" strokeWidth={3} />
                                                            </div>
                                                        )}

                                                        {/* Emoji + Badge row */}
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                            <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{cat.emoji}</span>
                                                            <span style={{
                                                                fontSize: '0.6rem',
                                                                fontWeight: 800,
                                                                color: cat.badgeColor,
                                                                background: `${cat.badgeColor}18`,
                                                                border: `1px solid ${cat.badgeColor}40`,
                                                                padding: '0.1rem 0.45rem',
                                                                borderRadius: '99px',
                                                                letterSpacing: '0.03em',
                                                                textTransform: 'uppercase'
                                                            }}>{cat.badge}</span>
                                                        </div>

                                                        {/* Title */}
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: isSelected ? cat.accentColor : '#1e293b', marginBottom: '0.25rem' }}>
                                                            {cat.label}
                                                        </div>

                                                        {/* Description */}
                                                        <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.4 }}>
                                                            {cat.description}
                                                        </div>

                                                        {/* Suggested amenities pills (shown when selected) */}
                                                        {isSelected && (
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.6rem' }}>
                                                                {cat.suggested_amenities.slice(0, 3).map(a => (
                                                                    <span key={a} style={{
                                                                        fontSize: '0.6rem',
                                                                        fontWeight: 700,
                                                                        color: cat.accentColor,
                                                                        background: `${cat.accentColor}12`,
                                                                        padding: '0.15rem 0.4rem',
                                                                        borderRadius: '6px'
                                                                    }}>✓ {a}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Auto-filled summary strip */}
                                        {formData.condition && HOUSE_CATALOG.find(c => c.id === formData.condition) && (() => {
                                            const cat = HOUSE_CATALOG.find(c => c.id === formData.condition);
                                            return (
                                                <div style={{
                                                    marginTop: '0.75rem',
                                                    padding: '0.75rem 1rem',
                                                    background: `${cat.accentColor}0d`,
                                                    border: `1px solid ${cat.accentColor}35`,
                                                    borderRadius: '10px',
                                                    display: 'flex',
                                                    gap: '1.5rem',
                                                    flexWrap: 'wrap',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Auto-filled:</span>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.accentColor }}>
                                                        🏠 {formData.room_count}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cat.accentColor, textTransform: 'capitalize' }}>
                                                        {formData.facility_type === 'shared' ? '👥 Shared Facilities' : '🔒 Private Facilities'}
                                                    </span>
                                                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
                                                        ✅ {formData.amenities.length} amenities selected
                                                    </span>
                                                </div>
                                            );
                                        })()}

                                        {/* Editable overrides */}
                                        {formData.condition && (
                                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, margin: 0 }}>✏️ Fine-tune details (auto-filled above)</p>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Facility Type</label>
                                                        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.3rem' }}>
                                                            {['private', 'shared'].map(type => (
                                                                <button
                                                                    key={type}
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, facility_type: type }))}
                                                                    style={{
                                                                        flex: 1,
                                                                        padding: '0.4rem 0.25rem',
                                                                        borderRadius: '7px',
                                                                        border: `1.5px solid ${formData.facility_type === type ? '#1d3d6e' : '#e2e8f0'}`,
                                                                        background: formData.facility_type === type ? '#1d3d6e' : 'white',
                                                                        color: formData.facility_type === type ? 'white' : '#64748b',
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 700,
                                                                        textTransform: 'capitalize',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >{type}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Rooms / Beds</label>
                                                        <input
                                                            type="text"
                                                            value={formData.room_count}
                                                            onChange={e => setFormData(prev => ({ ...prev, room_count: e.target.value }))}
                                                            style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '7px', border: '1.5px solid #e2e8f0', marginTop: '0.3rem', fontSize: '0.75rem' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Non-housing: simple condition buttons */
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        {['new', 'refurbished', 'second-hand'].map(cond => (
                                            <button
                                                key={cond}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, condition: cond })}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem 0.5rem',
                                                    borderRadius: '12px',
                                                    border: formData.condition === cond ? '2px solid var(--jiji-green)' : '1px solid #e2e8f0',
                                                    background: formData.condition === cond ? 'rgba(61, 184, 58, 0.08)' : 'white',
                                                    color: formData.condition === cond ? 'var(--jiji-green)' : '#64748b',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer',
                                                    textTransform: 'capitalize',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {cond}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                    {formData.category === 'housing' ? 'House Details & Rules' : 'Description'}
                                </label>
                                <textarea
                                    placeholder={formData.category === 'housing' ? "Describe the house, rules, shared areas, etc." : "Provide more details about your item..."}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ padding: '0.8rem 1rem', minHeight: '100px', borderRadius: '12px', border: '2px solid #e2e8f0', resize: 'none' }}
                                />
                            </div>

                            {formData.category === 'housing' && (
                                <>
                                    <div className="form-group" style={{ background: '#f0f9ff', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ShieldCheck size={18} /> Security Features
                                        </label>
                                        <textarea
                                            placeholder="Detail security (e.g., CCTV, Night Guard, 24hr gate man, Electric Fence)..."
                                            value={formData.security_features}
                                            onChange={e => setFormData({ ...formData, security_features: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bae6fd', marginTop: '0.5rem', minHeight: '80px', background: 'white' }}
                                        />
                                    </div>

                                    <div className="form-group" style={{ background: '#f0fdf4', padding: '1.25rem', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                                        <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Phone size={18} /> Contact Info
                                        </label>
                                        <p style={{ fontSize: '0.75rem', color: '#15803d', margin: '0.25rem 0 0.75rem 0' }}>How should students reach you? WhatsApp is default.</p>
                                        <input
                                            type="text"
                                            placeholder="Direct Phone Number / WhatsApp"
                                            value={formData.contact_phone}
                                            onChange={e => setFormData({ ...formData, contact_phone: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', background: 'white' }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Housing Amenities Checkboxes */}
                            {formData.category === 'housing' && (
                                <div className="form-group">
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>House Amenities</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        {['Free WiFi', 'Secure Fence', 'Water 24/7', 'Tokens Electricity', 'Tiles Floors', 'In-built Wardrobe', 'Balcony', 'Near Main Road'].map(amenity => (
                                            <div
                                                key={amenity}
                                                onClick={() => {
                                                    const newAmenities = formData.amenities.includes(amenity)
                                                        ? formData.amenities.filter(a => a !== amenity)
                                                        : [...formData.amenities, amenity];
                                                    setFormData({ ...formData, amenities: newAmenities });
                                                }}
                                                style={{
                                                    padding: '0.5rem 0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    background: formData.amenities.includes(amenity) ? 'rgba(0,174,239,0.1)' : 'white',
                                                    color: formData.amenities.includes(amenity) ? 'var(--campus-blue)' : '#64748b',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(amenity)}
                                                    readOnly
                                                    style={{ accentColor: 'var(--campus-blue)' }}
                                                />
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Location & Landmarks</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Specific Location e.g. Westlands, Nairobi"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        required
                                        style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0' }}
                                    />
                                    {formData.category === 'housing' && (
                                        <input
                                            type="text"
                                            placeholder="Landmarks or Nearby Universities"
                                            value={formData.landmarks}
                                            onChange={e => setFormData({ ...formData, landmarks: e.target.value })}
                                            style={{ padding: '0.8rem 1rem', borderRadius: '12px', border: '2px solid #e2e8f0', fontSize: '0.85rem' }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Housing Specific Location Picker */}
                            {formData.category === 'housing' && (
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    border: '1px dashed var(--campus-blue)',
                                    marginTop: '0.5rem'
                                }}>
                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--campus-blue)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Shield size={16} /> Exact House Location
                                    </h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>
                                        To help students find your house easily, pinpoint your exact location using Google Maps coordinates.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                                        {formData.latitude && formData.longitude ? (
                                            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc', position: 'relative' }}>
                                                <iframe
                                                    title="Location Preview"
                                                    width="100%"
                                                    height="250"
                                                    frameBorder="0"
                                                    style={{ border: 0 }}
                                                    src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=16&output=embed`}
                                                    allowFullScreen
                                                ></iframe>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'rgba(21, 128, 61, 0.9)',
                                                    color: 'white',
                                                    padding: '0.4rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.4rem',
                                                    backdropFilter: 'blur(4px)'
                                                }}>
                                                    <ShieldCheck size={14} /> LIVE PIN SECURED
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={locationLoading}
                                                onClick={() => {
                                                    if (!navigator.geolocation) {
                                                        addNotification('Error', 'Geolocation is not supported by your browser.', 'warning');
                                                        return;
                                                    }
                                                    setLocationLoading(true);
                                                    addNotification('Requesting GPS...', 'Please allow location access to pinpoint your house.', 'info');
                                                    navigator.geolocation.getCurrentPosition(
                                                        (position) => {
                                                            const lat = position.coords.latitude;
                                                            const lng = position.coords.longitude;
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                latitude: lat.toString(),
                                                                longitude: lng.toString()
                                                            }));
                                                            setLocationLoading(false);
                                                            addNotification('📍 GPS Captured!', 'Your live location is pinpointed. Now click "Upload Location" to confirm.', 'success');
                                                        },
                                                        (error) => {
                                                            setLocationLoading(false);
                                                            addNotification('Permission Denied', 'Please enable location access in your browser settings.', 'warning');
                                                        },
                                                        { enableHighAccuracy: true, timeout: 10000 }
                                                    );
                                                }}
                                                style={{
                                                    width: '100%',
                                                    padding: '1.25rem',
                                                    background: locationLoading ? '#94a3b8' : 'var(--jiji-green)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '16px',
                                                    fontWeight: 800,
                                                    fontSize: '0.95rem',
                                                    cursor: locationLoading ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.75rem',
                                                    boxShadow: '0 8px 20px rgba(61, 184, 58, 0.2)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <MapPin size={22} /> {locationLoading ? 'Getting GPS Location...' : 'GET LIVE LOCATION ON MINI-MAP'}
                                            </button>
                                        )}

                                        {formData.latitude && (
                                            locationUploaded ? (
                                                <div style={{
                                                    width: '100%',
                                                    padding: '1rem',
                                                    background: 'linear-gradient(135deg, #064e3b, #065f46)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '12px',
                                                    fontWeight: 800,
                                                    fontSize: '0.9rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: '0.5rem',
                                                    boxShadow: '0 4px 12px rgba(6, 78, 59, 0.3)'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <ShieldCheck size={20} />
                                                        <span>✅ LOCATION UPLOADED</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setLocationUploaded(false);
                                                            setFormData(prev => ({ ...prev, latitude: '', longitude: '' }));
                                                            addNotification('Reset', 'Location cleared. You can re-capture it.', 'info');
                                                        }}
                                                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '8px', padding: '0.25rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 700 }}
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLocationUploaded(true);
                                                        addNotification('✅ Location Uploaded!', `Coordinates saved: ${parseFloat(formData.latitude).toFixed(5)}, ${parseFloat(formData.longitude).toFixed(5)}. This will be attached to your post.`, 'success');
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        background: 'linear-gradient(135deg, #15803d, #166534)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        boxShadow: '0 6px 16px rgba(21, 128, 61, 0.4)',
                                                        animation: 'pulse 1.5s ease-in-out infinite'
                                                    }}
                                                >
                                                    <ShieldCheck size={18} /> UPLOAD THIS LIVE LOCATION
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
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
                        {loading ? 'Processing...' : (formData.category === 'housing' ? 'Post House / Hostel' : 'Complete Listing')}
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
