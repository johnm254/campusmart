import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../AppContext';
import { api } from '../lib/api';
import { Send, Search, MessageSquare, Phone, MoreVertical, CheckCheck, Check, Star } from 'lucide-react';
import UserReviewModal from '../components/modals/UserReviewModal';

const Messages = () => {
    const { user, addNotification } = useApp();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesContainerRef = useRef(null);
    const pollRef = useRef(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [otherUserRating, setOtherUserRating] = useState({ average_rating: 0, review_count: 0 });

    // Scroll to bottom of messages
    const scrollToBottom = (force = false) => {
        if (!messagesContainerRef.current) return;
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

        if (force || isNearBottom) {
            // Setting scrollTop directly avoids jumping the "main scroll bar"
            container.scrollTop = container.scrollHeight;
        }
    };

    // Load conversations
    const loadConversations = async () => {
        try {
            const data = await api.getConversations();
            if (Array.isArray(data)) {
                setConversations(data);
                // Update selected conversation status if it exists in the list
                if (selectedConv) {
                    const updatedSelected = data.find(c => c.other_user_id === selectedConv.other_user_id);
                    if (updatedSelected) setSelectedConv(updatedSelected);
                }
            }
        } catch (err) {
            console.error('Error loading conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load messages for selected conversation
    const loadMessages = async (otherUserId, isNewFetch = false) => {
        try {
            const data = await api.getMessages(otherUserId);
            if (Array.isArray(data)) {
                const hasNewMessages = data.length > messages.length;
                setMessages(data);
                // The user wants to remove "scroll by itself when opened"
                // So we only scroll if NOT a new fetch and there are actual new messages.
                if (!isNewFetch && hasNewMessages) {
                    scrollToBottom(data[data.length - 1].sender_id === user?.id);
                }
                // Refresh conversations to clear unread badge and update status
                loadConversations();
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    };

    useEffect(() => {
        loadConversations();
    }, []);

    // Poll for new messages every 5 seconds when a conversation is open
    useEffect(() => {
        if (selectedConv) {
            loadMessages(selectedConv.other_user_id, true);
            fetchOtherUserRating(selectedConv.other_user_id);
            pollRef.current = setInterval(() => {
                loadMessages(selectedConv.other_user_id);
            }, 5000);
        }
        return () => clearInterval(pollRef.current);
    }, [selectedConv?.other_user_id]);

    const fetchOtherUserRating = async (otherUserId) => {
        try {
            const res = await api.getUserRating(otherUserId);
            if (res && res.average_rating !== undefined) {
                setOtherUserRating(res);
            }
        } catch (err) {
            console.error('Error fetching user rating:', err);
        }
    };

    const handleSelectConv = (conv) => {
        setSelectedConv(conv);
        // Clear messages briefly to show loading state if preferred, 
        // but user might want it to feel faster. 
        setMessages([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedConv) return;

        setSending(true);
        const content = messageInput.trim();
        setMessageInput('');

        // Optimistic UI update
        const tempMsg = {
            id: `temp-${Date.now()}`,
            sender_id: user.id,
            receiver_id: selectedConv.other_user_id,
            content,
            created_at: new Date().toISOString(),
            is_read: false,
            is_delivered: false,
            sender_name: user.full_name
        };
        setMessages(prev => [...prev, tempMsg]);
        // Force scroll on send because it's user action
        setTimeout(() => scrollToBottom(true), 50);

        try {
            const result = await api.sendMessage(selectedConv.other_user_id, content);
            if (result.id) {
                setMessages(prev => prev.map(m => m.id === tempMsg.id ? result : m));
                loadConversations();
            } else {
                setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
                addNotification('Error', result.message || 'Failed to send message.', 'error');
                setMessageInput(content);
            }
        } catch (err) {
            setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
            addNotification('Error', 'Network error. Please try again.', 'error');
            setMessageInput(content);
        } finally {
            setSending(false);
        }
    };

    const isUserOnline = (lastSeen) => {
        if (!lastSeen) return false;
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        // Increase tolerance to 5 minutes to handle heartbeat gaps or timezone issues
        return Math.abs(now - lastSeenDate) < 300000;
    };

    const filteredConvs = conversations.filter(c =>
        c.other_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const getMessageStatusIcon = (msg) => {
        if (msg.is_read) return <CheckCheck size={14} color="#3db83a" />;
        if (msg.is_delivered) return <CheckCheck size={14} color="#aaa" />;
        return <Check size={14} color="#aaa" />;
    };

    return (
        <div className="container" style={{ height: 'calc(100vh - 120px)', marginTop: '20px', display: 'flex', gap: '1px', background: '#eee', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            {/* Sidebar */}
            <div style={{ width: '350px', background: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
                    <h2 style={{ marginBottom: '1rem', color: 'var(--campus-blue)' }}>Messages</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 40px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Loading chats...</div>
                    ) : filteredConvs.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#bbb' }}>
                            <MessageSquare size={40} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                            <p style={{ fontSize: '0.9rem' }}>No conversations yet.<br />Start one from a product listing!</p>
                        </div>
                    ) : (
                        filteredConvs.map(conv => (
                            <div
                                key={conv.id}
                                onClick={() => handleSelectConv(conv)}
                                style={{
                                    padding: '1.25rem',
                                    display: 'flex',
                                    gap: '1rem',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid #f5f5f5',
                                    background: selectedConv?.other_user_id === conv.other_user_id ? '#f0f7ff' : 'white',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={conv.other_user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.other_user_name || 'User')}&background=random`}
                                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                                        alt={conv.other_user_name}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '2px',
                                        right: '2px',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: isUserOnline(conv.other_user_last_seen) ? 'var(--jiji-green)' : '#ccc',
                                        border: '2px solid white'
                                    }}></div>
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{conv.other_user_name}</span>
                                        <span style={{ fontSize: '0.72rem', color: '#999', flexShrink: 0 }}>{formatTime(conv.created_at)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ fontSize: '0.83rem', color: parseInt(conv.unread_count) > 0 ? '#333' : '#777', fontWeight: parseInt(conv.unread_count) > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', margin: 0 }}>
                                            {conv.sender_id === user?.id ? (
                                                <span style={{ marginRight: '4px' }}>
                                                    {conv.is_read ? <CheckCheck size={12} color="#3db83a" /> : conv.is_delivered ? <CheckCheck size={12} color="#aaa" /> : <Check size={12} color="#aaa" />}
                                                </span>
                                            ) : ''}
                                            {conv.last_message}
                                        </p>
                                        {parseInt(conv.unread_count) > 0 && (
                                            <span style={{ background: 'var(--jiji-green)', color: 'white', fontSize: '0.7rem', minWidth: '20px', height: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0 }}>
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, background: '#f5f7f9', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div style={{ padding: '1rem 2rem', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ position: 'relative' }}>
                                    <img
                                        src={selectedConv.other_user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedConv.other_user_name || 'User')}&background=random`}
                                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                                        alt={selectedConv.other_user_name}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0px',
                                        right: '0px',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        background: isUserOnline(selectedConv.other_user_last_seen) ? 'var(--jiji-green)' : '#ccc',
                                        border: '2px solid white'
                                    }}></div>
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{selectedConv.other_user_name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={10}
                                                    fill={otherUserRating.average_rating >= star ? "#FFD700" : "none"}
                                                    color={otherUserRating.average_rating >= star ? "#FFD700" : "#cbd5e0"}
                                                />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.65rem', color: '#888', fontWeight: 700 }}>({otherUserRating.review_count})</span>
                                        <span style={{ margin: '0 0.25rem', color: '#ddd' }}>|</span>
                                        <span style={{ fontSize: '0.75rem', color: isUserOnline(selectedConv.other_user_last_seen) ? 'var(--jiji-green)' : '#999' }}>
                                            {isUserOnline(selectedConv.other_user_last_seen) ? 'Active now' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    style={{
                                        background: '#eef2ff',
                                        color: 'var(--campus-blue)',
                                        border: 'none',
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <Star size={14} fill="currentColor" /> Rate User
                                </button>
                                <MoreVertical size={20} style={{ cursor: 'pointer', color: '#666' }} />
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={messagesContainerRef} style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#bbb', marginTop: '3rem' }}>
                                    <p>No messages yet. Say hello! 👋</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMine = msg.sender_id === user?.id;
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                background: isMine ? 'var(--campus-blue)' : 'white',
                                                color: isMine ? 'white' : '#333',
                                                padding: '0.65rem 1rem',
                                                borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                                maxWidth: '70%',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
                                                fontSize: '0.92rem',
                                                lineHeight: 1.5
                                            }}>
                                                {msg.content}
                                            </div>
                                            <span style={{ fontSize: '0.68rem', color: '#aaa', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                                {formatTime(msg.created_at)}
                                                {isMine && getMessageStatusIcon(msg)}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', background: 'white', display: 'flex', gap: '0.75rem', borderTop: '1px solid #eee' }}>
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                                disabled={sending}
                                style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: '25px', border: '1px solid #eee', background: '#f9f9f9', outline: 'none', fontSize: '0.95rem' }}
                            />
                            <button
                                type="submit"
                                disabled={!messageInput.trim() || sending}
                                style={{ background: messageInput.trim() ? 'var(--jiji-green)' : '#ccc', color: 'white', border: 'none', width: '46px', height: '46px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: messageInput.trim() ? 'pointer' : 'not-allowed', transition: 'background 0.2s', flexShrink: 0 }}
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
                        <MessageSquare size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p style={{ fontSize: '1rem' }}>Select a conversation to start chatting</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Or send a message from a product listing</p>
                    </div>
                )}
            </div>

            {selectedConv && (
                <UserReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    revieweeId={selectedConv.other_user_id}
                    revieweeName={selectedConv.other_user_name}
                    onReviewSubmitted={() => fetchOtherUserRating(selectedConv.other_user_id)}
                />
            )}
        </div>
    );
};

export default Messages;
