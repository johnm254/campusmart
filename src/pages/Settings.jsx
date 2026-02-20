import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import ImageCropperModal from '../components/ui/ImageCropperModal';
import { Camera, Save, User, Phone, Mail, ShieldCheck, Star } from 'lucide-react';

const Settings = () => {
    const { user, setUser, addNotification } = useApp();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp: '',
        avatar_url: ''
    });
    const [tempImage, setTempImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || user.name || '',
                whatsapp: user.whatsapp || '',
                avatar_url: user.avatar_url || user.avatar || ''
            });
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setTempImage(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = (croppedImage) => {
        setFormData({ ...formData, avatar_url: croppedImage });
        setShowCropper(false);
        setTempImage(null);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const res = await api.updateUser({
                full_name: formData.full_name,
                whatsapp: formData.whatsapp,
                avatar_url: formData.avatar_url
            });

            if (res.message === 'Profile updated successfully') {
                const updatedUser = { ...user, ...formData };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                addNotification('Success', 'Profile updated successfully!', 'success');
            } else {
                throw new Error(res.message || 'Update failed');
            }
        } catch (error) {
            addNotification('Error', error.message, 'warning');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', color: 'var(--campus-blue)' }}>Account Settings</h2>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSave}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <img
                                src={formData.avatar_url || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f0f0f0' }}
                            />
                            <label
                                htmlFor="avatar-input"
                                style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--jiji-green)', color: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                            >
                                <Camera size={20} />
                            </label>
                            <input type="file" id="avatar-input" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Click the camera icon to update your profile photo</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                                <User size={18} /> Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Your full name"
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #ddd' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                                <Phone size={18} /> WhatsApp Number
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                placeholder="+254..."
                                style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 600, opacity: 0.6 }}>
                            <Mail size={18} /> Student Email (Fixed)
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'not-allowed' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ marginTop: '2.5rem', width: '100%', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1.1rem' }}
                    >
                        <Save size={20} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>

            {/* Verification Status Section */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={24} color="var(--campus-blue)" />
                    Account Verification
                </h3>

                {user?.is_verified ? (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.1) 100%)',
                        padding: '2rem',
                        borderRadius: '20px',
                        border: '2px solid #FFD700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 8px 20px rgba(255, 215, 0, 0.4)'
                        }}>
                            <Star size={32} fill="white" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#b8860b' }}>PREMIUM VERIFIED</div>
                            <p style={{ color: '#666', margin: '0.5rem 0 0', fontWeight: 500 }}>
                                Your listings are boosted 15x and you have the golden badge visible to all buyers.
                            </p>
                            {user.verified_until && (
                                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.75rem', fontWeight: 600 }}>
                                    Active until: {new Date(user.verified_until).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '1px dashed #cbd5e0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#475569' }}>Standard Student Account</div>
                                <p style={{ color: '#64748b', margin: '0.5rem 0 0', maxWidth: '400px' }}>
                                    Get verified to unlock the Golden Badge, boost your products 15x, and build trust with buyers.
                                </p>
                            </div>
                            <button
                                className="btn-jiji-green"
                                style={{ padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 800 }}
                                onClick={() => addNotification('Premium', 'Redirecting to verification...', 'success')}
                            >
                                GET VERIFIED
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showCropper && (
                <ImageCropperModal
                    image={tempImage}
                    onCrop={handleCrop}
                    onClose={() => setShowCropper(false)}
                    aspectRatio={1}
                />
            )}
        </div>
    );
};

export default Settings;
