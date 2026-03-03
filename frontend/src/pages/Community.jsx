import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import { MessageSquare, Plus, Heart, MessageCircle, Share2, MoreVertical, ShieldCheck, X, Send, Tag, ImagePlus, Trash2, Crop, Star } from 'lucide-react';
import ImageCropperModal from '../components/ui/ImageCropperModal';

const Community = () => {
    const { user, addNotification, setIsAuthModalOpen } = useApp();
    const [activeTab, setActiveTab] = useState('all');
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostType, setNewPostType] = useState('general');
    const [newPostImage, setNewPostImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCropper, setShowCropper] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const fileInputRef = useRef(null);

    const tabs = [
        { id: 'all', label: 'All Activity', icon: MessageSquare },
        { id: 'market', label: 'Marketplace', icon: Tag },
        { id: 'general', label: 'General', icon: MessageCircle },
    ];

    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const data = await api.getCommunityPosts();
            if (Array.isArray(data)) {
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const comments = await api.getPostComments(postId);
            const list = document.getElementById(`comments-list-${postId}`);
            if (list) {
                list.innerHTML = comments.map(c => `
                    <div style="background: #f8f9fa; padding: 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <span style="font-weight: 700; color: var(--campus-blue);">${c.author_name}</span>
                            <span style="color: #999; font-size: 0.75rem;">${new Date(c.created_at).toLocaleDateString()}</span>
                        </div>
                        <div style="color: #4a5568;">${c.content}</div>
                    </div>
                `).join('') || '<div style="text-align: center; color: #999; font-size: 0.8rem; padding: 1rem;">No comments yet. Be the first to shout!</div>';
            }
        } catch (e) {
            console.error('Error fetching comments:', e);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        try {
            const res = await api.togglePostLike(postId);
            if (res.action === 'liked') {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: parseInt(p.likes) + 1, is_liked: true } : p));
            } else {
                setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: parseInt(p.likes) - 1, is_liked: false } : p));
            }
        } catch (error) {
            addNotification('Error', 'Failed to update like', 'warning');
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            addNotification('Error', 'Image must be less than 5MB', 'warning');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImage(reader.result);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCrop = (croppedImage) => {
        setNewPostImage(croppedImage);
        setImagePreview(croppedImage);
        setShowCropper(false);
        setTempImage(null);
    };

    const removeImage = () => {
        setNewPostImage('');
        setImagePreview('');
        setTempImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        if (!newPostContent.trim()) return;
        setIsSubmitting(true);

        try {
            const res = await api.createCommunityPost({
                content: newPostContent,
                type: newPostType,
                image_url: newPostImage || null
            });

            if (res && res.id) {
                addNotification('Success', 'Post created successfully!', 'success');
                setIsCreateModalOpen(false);
                setNewPostContent('');
                setNewPostImage('');
                setImagePreview('');
                fetchPosts();
            } else if (res.error || res.message) {
                addNotification('Error', res.message || 'Failed to create post', 'warning');
            }
        } catch (error) {
            addNotification('Error', 'Network error', 'warning');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const getTypeLabel = (type) => {
        if (type === 'general' || type === 'discussion') return 'General';
        if (type === 'market') return 'Market';
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const filteredPosts = activeTab === 'all'
        ? posts
        : activeTab === 'general'
            ? posts.filter(p => p.type === 'general' || p.type === 'discussion')
            : posts.filter(p => p.type === activeTab);

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--campus-blue)', marginBottom: '0.5rem' }}>Campus Community</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Connect, share updates, and stay updated with fellow comrades.</p>
                </div>
                {user ? (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
                    >
                        <Plus size={20} /> Create Post
                    </button>
                ) : (
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
                    >
                        Login to Post
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem', overflowX: 'auto' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--campus-blue)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>Loading community posts...</div>
                ) : filteredPosts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '24px', color: '#888' }}>
                        No posts found in this category. Be the first to share something!
                    </div>
                ) : (
                    filteredPosts.map(post => (
                        <div key={post.id} style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            paddingTop: post.is_admin ? '2.8rem' : '1.5rem',
                            boxShadow: post.is_admin ? '0 10px 30px rgba(0, 174, 239, 0.12)' : '0 4px 20px rgba(0,0,0,0.04)',
                            border: post.is_admin ? '2px solid var(--campus-blue)' : '1px solid #f0f0f0',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <img src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name || 'U')}&background=random`} style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover' }} alt={post.author_name} />
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{post.author_name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#999', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                {post.author_rating > 0 && (
                                                    <>
                                                        <Star size={12} fill="#FFD700" color="#FFD700" />
                                                        <span style={{ fontWeight: 800, color: '#b8860b' }}>{(Number(post.author_rating) || 0).toFixed(1)}</span>
                                                    </>
                                                )}
                                                {formatTime(post.created_at)} ΓÇó {getTypeLabel(post.type)}
                                            </span>
                                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: '#f0f0f0', color: '#666', borderRadius: '4px', fontWeight: 600 }}>
                                                {post.is_admin ? 'Admin' : 'Member'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <button
                                        onClick={(e) => {
                                            const menu = e.currentTarget.nextSibling;
                                            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
                                        }}
                                        style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: '0.5rem' }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>
                                    <div style={{
                                        display: 'none',
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        background: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        zIndex: 10,
                                        minWidth: '160px',
                                        padding: '0.5rem',
                                        border: '1px solid #f0f0f0'
                                    }}>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}?post=${post.id}`);
                                                addNotification('Copied', 'Post link copied', 'info');
                                            }}
                                            style={{ width: '100%', textAlign: 'left', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#666' }}
                                        >
                                            Copy Link
                                        </button>
                                        {(user?.id == post.author_id || user?.is_admin) && (
                                            <button
                                                onClick={async () => {
                                                    if (!window.confirm('Permanently delete this post?')) return;
                                                    try {
                                                        await api.deleteCommunityPost(post.id);
                                                        addNotification('Deleted', 'Post removed', 'success');
                                                        fetchPosts();
                                                    } catch (e) { addNotification('Error', 'Delete failed', 'warning'); }
                                                }}
                                                style={{ width: '100%', textAlign: 'left', padding: '0.75rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#ff4d4f' }}
                                            >
                                                Delete Post
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.6, marginBottom: '1rem', paddingLeft: '0.25rem', whiteSpace: 'pre-wrap' }}>
                                {post.content}
                            </div>

                            {/* Post Image */}
                            {post.image_url && (
                                <div style={{ marginBottom: '1rem', borderRadius: '16px', overflow: 'hidden' }}>
                                    <img
                                        src={post.image_url}
                                        alt="Post attachment"
                                        style={{
                                            width: '100%',
                                            maxHeight: '500px',
                                            objectFit: 'cover',
                                            borderRadius: '16px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => window.open(post.image_url, '_blank')}
                                    />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #f8f8f8', paddingTop: '1rem', marginBottom: '1rem' }}>
                                <button
                                    onClick={() => handleLike(post.id)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: post.is_liked ? 'var(--jiji-orange)' : '#666', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                                >
                                    <Heart size={20} fill={post.is_liked ? 'var(--jiji-orange)' : 'none'} color={post.is_liked ? 'var(--jiji-orange)' : '#666'} /> {post.likes}
                                </button>
                                <button
                                    onClick={() => {
                                        const commentSection = document.getElementById(`comments-${post.id}`);
                                        commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
                                        if (commentSection.style.display === 'block') {
                                            fetchComments(post.id);
                                        }
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    <MessageCircle size={20} /> {post.comments}
                                </button>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}?post=${post.id}`);
                                        addNotification('Link Copied', 'Post link copied to clipboard!', 'info');
                                    }}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontWeight: 600, marginLeft: 'auto' }}
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>

                            <div id={`comments-${post.id}`} style={{ display: 'none', borderTop: '1px solid #f0f0f0', marginTop: '1rem', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Write a comment..."
                                        id={`comment-input-${post.id}`}
                                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #eee', fontSize: '0.9rem' }}
                                        onKeyPress={async (e) => {
                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                if (!user) { setIsAuthModalOpen(true); return; }
                                                try {
                                                    await api.addPostComment(post.id, e.target.value);
                                                    e.target.value = '';
                                                    fetchPosts();
                                                    fetchComments(post.id);
                                                } catch (e) { addNotification('Error', 'Failed to comment', 'warning'); }
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById(`comment-input-${post.id}`);
                                            if (!input.value.trim()) return;
                                            if (!user) { setIsAuthModalOpen(true); return; }
                                            try {
                                                await api.addPostComment(post.id, input.value);
                                                input.value = '';
                                                fetchPosts();
                                                fetchComments(post.id);
                                            } catch (e) { addNotification('Error', 'Failed to comment', 'warning'); }
                                        }}
                                        style={{ background: 'var(--campus-blue)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '12px', cursor: 'pointer' }}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                                <div id={`comments-list-${post.id}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Post Modal */}
            {isCreateModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2 style={{ color: 'var(--campus-blue)' }}>Create New Post</h2>
                            <button className="close-btn" onClick={() => { setIsCreateModalOpen(false); removeImage(); }}><X /></button>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <div className="form-group">
                                <label>Post Type</label>
                                <select
                                    value={newPostType}
                                    onChange={(e) => setNewPostType(e.target.value)}
                                    style={{ padding: '0.8rem' }}
                                >
                                    <option value="general">General</option>
                                    <option value="market">Marketplace Update</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>What's on your mind?</label>
                                <textarea
                                    required
                                    placeholder="Share an update, ask a question, or post something to fellow comrades..."
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    style={{ height: '120px', resize: 'none' }}
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="form-group">
                                <label>Add Photo (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    style={{ display: 'none' }}
                                />
                                {!imagePreview ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{
                                            border: '2px dashed #ddd',
                                            borderRadius: '16px',
                                            padding: '2rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: '#fafafa'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--campus-blue)'; e.currentTarget.style.background = '#f0f4ff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.background = '#fafafa'; }}
                                    >
                                        <ImagePlus size={36} color="#bbb" style={{ marginBottom: '0.5rem' }} />
                                        <p style={{ color: '#999', fontSize: '0.9rem', margin: 0 }}>Click to upload a photo</p>
                                        <p style={{ color: '#ccc', fontSize: '0.75rem', margin: '0.25rem 0 0' }}>Max 5MB ΓÇó JPG, PNG, GIF</p>
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '16px' }}
                                        />
                                        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                title="Change image"
                                                style={{
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Crop size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                title="Remove image"
                                                style={{
                                                    background: 'rgba(220,53,69,0.85)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '32px',
                                                    height: '32px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginTop: '1rem',
                                    opacity: isSubmitting ? 0.7 : 1
                                }}
                            >
                                {isSubmitting ? 'Posting...' : <><Send size={20} /> Post to Community</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Shared Cropper Modal ΓÇö free aspect ratio for community posts */}
            {showCropper && (
                <ImageCropperModal
                    image={tempImage}
                    onCrop={handleCrop}
                    onClose={() => { setShowCropper(false); setTempImage(null); }}
                    aspectRatio={NaN}
                />
            )}
        </div>
    );
};

export default Community;
