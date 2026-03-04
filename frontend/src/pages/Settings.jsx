import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import ImageCropperModal from '../components/ui/ImageCropperModal';
import { Camera, Save, User, Phone, Mail, ShieldCheck, Star } from 'lucide-react';
import BackButton from '../components/ui/BackButton';

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
            <BackButton />
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

            {/* Removed Verification Section — Platform is now free for all */}

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
