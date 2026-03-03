import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Search, ChevronRight, User, ShieldCheck, Zap, HelpCircle, Info, Rocket, Smartphone, ShieldAlert, GraduationCap } from 'lucide-react';
import { useApp } from '../../AppContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Chatbot = () => {
    const { user } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Martie, your CampusMart assistant. How can I help you today?", sender: 'bot', time: new Date() }
    ]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const knowledgeBase = {
        categories: [
            { id: 'account', label: 'Account & Login', icon: <User size={18} /> },
            { id: 'selling', label: 'Listings & Selling', icon: <Rocket size={18} /> },
            { id: 'buying', label: 'Buying & Browsing', icon: <Search size={18} /> },
            { id: 'payments', label: 'Payments & Boosts', icon: <Zap size={18} /> },
            { id: 'safety', label: 'Safety & Trust', icon: <ShieldCheck size={18} /> },
            { id: 'policies', label: 'Policies & Info', icon: <Info size={18} /> },
            { id: 'tech', label: 'Technical Support', icon: <Smartphone size={18} /> },
            { id: 'promos', label: 'Offers & Promos', icon: <HelpCircle size={18} /> },
            { id: 'campus', label: 'Campus Specific', icon: <GraduationCap size={18} /> },
        ],
        questions: [
            // Account & Login
            { cat: 'account', q: 'How do I create an account?', a: 'Click the "Sign In" button in the top right corner, then select "Create Account". You\'ll need your full name, email, and a password.' },
            { cat: 'account', q: 'Can I log in with my student ID?', a: 'Currently, you log in using your registered email and password. Your student ID is used for verification purposes to ensure a safe community.' },
            { cat: 'account', q: 'I forgot my password, how do I reset it?', a: 'On the Sign In screen, click "Forgot Password?". We will send a reset link to your registered email.' },
            { cat: 'account', q: 'Can I change my profile photo or name?', a: 'Yes! Go to "Settings" from your profile menu. You can update your full name and upload a new profile picture there.' },
            { cat: 'account', q: 'How do I verify my student status?', a: 'CampusMart is built exclusively for the student community. Simply use your student email or provide campus details during registration to join our free network!' },
            { cat: 'account', q: 'How do I deactivate my account?', a: 'Contact our support team via the Feedback button or email us at support@campusmart.co.ke' },

            // Listings & Selling
            { cat: 'selling', q: 'How do I post an item for sale?', a: 'Click the "Sell" button in the navigation bar. Fill in the details, upload up to 5 photos, and click "Post Product". It's 100% free!' },
            { cat: 'selling', q: 'How many photos can I upload per listing?', a: 'All users can upload up to 5 clear photos per listing at no cost.' },
            { cat: 'selling', q: 'Can I edit or delete a listing?', a: 'Yes, go to your Dashboard. You' + "'" + 'll see all your listings with options to Edit or Delete them.' },
            { cat: 'selling', q: 'What happened to the Boost packages?', a: 'CampusMart is now 100% free for everyone! We removed paid packages to ensure every student has an equal chance to sell their items quickly.' },
            { cat: 'selling', q: 'Why isn't my listing showing?', a: 'New listings may undergo a quick review. If it' + "'" + 's been over 2 hours, please ensure your listing doesn' + "'" + 't violate our community policies.' },

            // Buying & Browsing
            { cat: 'buying', q: 'How do I search for items?', a: 'Use the search bar at the top of the Marketplace page. You can search by product name, category, or keyword.' },
            { cat: 'buying', q: 'How do I contact a seller?', a: 'Click on a product to open its details. You' + "'" + 'll see "Send Message" and "Chat on WhatsApp" buttons.' },
            { cat: 'buying', q: 'How do I report a fake listing?', a: 'Open the product details, and use the "Report" feature or send a message via the Feedback center with the product name.' },

            // Payments & Boosts
            { cat: 'payments', q: 'How do I pay for a boost?', a: 'Go to the "Premium" section, select your plan, enter your M-Pesa number, and you' + "'" + 'll get a prompt on your phone to enter your PIN.' },
            { cat: 'payments', q: 'Can I use M-Pesa to pay?', a: 'Yes! M-Pesa is our primary payment method for all boost packages.' },
            { cat: 'payments', q: 'Why did my payment fail?', a: 'Check if you have sufficient M-Pesa balance, ensured your phone was active, and entered the correct PIN.' },

            // Safety & Trust
            { cat: 'safety', q: 'How do I know a seller is a real student?', a: 'Check their ratings and reviews from other students. We encourage everyone to trade safely within campus grounds.' },
            { cat: 'safety', q: 'Should I meet a seller inside campus?', a: 'YES! We always recommend meeting in public, well-lit areas on campus during daylight hours for your safety.' },
            { cat: 'safety', q: 'What are the safety tips?', a: '1. Meet on campus. 2. Inspect the item before paying. 3. Avoid paying in advance. 4. Bring a friend if possible.' },

            // Policies
            { cat: 'policies', q: 'What items are not allowed?', a: 'Drugs, alcohol, weapons, counterfeit goods, adult content, and any illegal services are strictly prohibited.' },
            { cat: 'policies', q: 'How is this different from Jiji?', a: 'CampusMart is exclusive to students. It' + "'" + 's safer because traders are within the same university community.' },

            // Tech Support
            { cat: 'tech', q: 'How do I report a bug?', a: 'Use the "Feedback" button on the bottom right and select "Report Bug". Our dev team will look into it immediately!' },
            { cat: 'tech', q: 'Clear cache to fix errors?', a: 'In your browser settings, go to Privacy/Security and Clear Browsing Data (specifically Cookies and Cached Images).' },

            // Promotions & Offers
            { cat: 'promos', q: 'Are there deals for new users?', a: 'Yes! New users often get a 20% discount on their first Power Boost. Check your notifications for a promo code!' },
            { cat: 'promos', q: 'Can I get free boosts?', a: 'We occasionally run "Free Boost Friday" where 5 lucky items are chosen for a free Power upgrade. Stay active to increase your chances!' },

            // Campus Specific
            { cat: 'campus', q: 'Can I filter items by my hostel?', a: 'Yes! When browsing the Marketplace, use the "Filter" option and select your specific Hostel to see items nearest to you.' },
            { cat: 'campus', q: 'Are listings only for specific students?', a: 'The platform is optimized for all university students and staff in Kenya.' },
            { cat: 'campus', q: 'Can alumni post items?', a: 'Yes, as long as you can meet the buyer on or near campus for the exchange.' },
            { cat: 'campus', q: 'Is there a guide for freshers on what to buy?', a: 'Welcome to Campus! We recommend checking the "Freshers Essentials" category for deals on mattresses, storage boxes, and kettles.' },
        ]
    };

    const handleSendMessage = (text) => {
        if (!text.trim()) return;

        const userMsg = { id: Date.now(), text, sender: 'user', time: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setSearchTerm('');
        setIsTyping(true);

        // Simulate bot thinking
        setTimeout(() => {
            const botResponse = findBestAnswer(text);
            const botMsg = { id: Date.now() + 1, text: botResponse.a, sender: 'bot', time: Date.now(), suggestions: botResponse.suggestions };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const findBestAnswer = (input) => {
        const lowerInput = input.toLowerCase();

        // Find exact or partial match in questions
        const match = knowledgeBase.questions.find(item =>
            lowerInput.includes(item.q.toLowerCase()) ||
            item.q.toLowerCase().includes(lowerInput)
        );

        if (match) return match;

        // Keywords fallback
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return { a: "Hello there! How can I help you navigate CampusMart today?" };
        }
        if (lowerInput.includes('payment') || lowerInput.includes('mpesa')) {
            return { a: "For payments, we use M-Pesa STK Push. Make sure your phone is unlocked and you have enough balance." };
        }
        if (lowerInput.includes('boost') || lowerInput.includes('verify')) {
            return { a: "CampusMart is now completely free! All listings get equal visibility to the entire campus community." };
        }

        return {
            a: "I'm not quite sure about that. Try selecting a category below or check our core FAQs.",
            suggestions: knowledgeBase.categories.slice(0, 3)
        };
    };

    const selectCategory = (cat) => {
        setCurrentCategory(cat);
        const catQuestions = knowledgeBase.questions.filter(q => q.cat === cat.id);

        const botMsg = {
            id: Date.now(),
            text: `Great! Here are the most common questions about ${cat.label}:`,
            sender: 'bot',
            time: new Date(),
            choices: catQuestions
        };
        setMessages(prev => [...prev, botMsg]);
    };

    return (
        <div style={{ position: 'fixed', bottom: isMobile ? '80px' : '110px', right: isMobile ? '15px' : '30px', zIndex: 5000 }}>
            {isOpen ? (
                <div style={{
                    width: isMobile ? '90vw' : '340px',
                    maxWidth: '340px',
                    height: isMobile ? '70vh' : '480px',
                    maxHeight: isMobile ? '500px' : '480px',
                    background: '#ffffff',
                    borderRadius: isMobile ? '20px' : '24px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    animation: 'chatSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    marginBottom: '10px'
                }}>
                    <style>{`
                        @keyframes chatSlideIn {
                            from { opacity: 0; transform: translateY(40px) scale(0.9); }
                            to { opacity: 1; transform: translateY(0) scale(1); }
                        }
                    `}</style>

                    {/* Chat Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1d3d6e 0%, #00aeef 100%)',
                        color: 'white',
                        padding: isMobile ? '1rem' : '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '0.6rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ width: isMobile ? '34px' : '38px', height: isMobile ? '34px' : '38px', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1d3d6e' }}>
                                    <MessageCircle size={isMobile ? 18 : 22} />
                                </div>
                                <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', background: '#22c55e', border: '2px solid white', borderRadius: '50%' }}></div>
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: isMobile ? '0.9rem' : '1rem', fontWeight: 800 }}>Martie</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: isMobile ? '0.65rem' : '0.7rem', opacity: 0.9 }}>
                                    <div style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
                                    Online Assistant
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div style={{ flex: 1, padding: isMobile ? '1rem' : '1.25rem', overflowY: 'auto', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.75rem' : '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: isMobile ? '0.85rem 1rem' : '1rem 1.25rem',
                                    borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                    background: msg.sender === 'user' ? '#1d3d6e' : '#fff',
                                    color: msg.sender === 'user' ? '#fff' : '#1e293b',
                                    boxShadow: msg.sender === 'user' ? '0 5px 15px rgba(29, 61, 110, 0.2)' : '0 5px 15px rgba(0,0,0,0.03)',
                                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                                    lineHeight: 1.5,
                                    border: msg.sender === 'bot' ? '1px solid #f1f5f9' : 'none'
                                }}>
                                    {msg.text}
                                </div>

                                {msg.choices && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem', width: '100%' }}>
                                        {msg.choices.map((choice, j) => (
                                            <button
                                                key={j}
                                                onClick={() => handleSendMessage(choice.q)}
                                                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.85rem', cursor: 'pointer', color: '#1d3d6e', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: '0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = '#1d3d6e'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                                            >
                                                {choice.q}
                                                <ChevronRight size={14} />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', gap: '4px', padding: '10px 15px', background: '#fff', borderRadius: '15px', width: 'fit-content', boxShadow: '0 5px 15px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9' }}>
                                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out' }}></div>
                                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out 0.2s' }}></div>
                                <div className="dot" style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'typingDot 1.4s infinite ease-in-out 0.4s' }}></div>
                            </div>
                        )}

                        {/* Initial Categories */}
                        {messages.length === 1 && (
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                                {knowledgeBase.categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => selectCategory(cat)}
                                        style={{
                                            padding: isMobile ? '0.65rem' : '0.75rem',
                                            background: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            display: 'flex',
                                            flexDirection: isMobile ? 'row' : 'column',
                                            alignItems: 'center',
                                            gap: isMobile ? '0.75rem' : '0.5rem',
                                            cursor: 'pointer',
                                            transition: '0.2s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#1d3d6e'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <div style={{ color: '#1d3d6e' }}>{cat.icon}</div>
                                        <span style={{ fontSize: isMobile ? '0.8rem' : '0.75rem', fontWeight: 700, color: '#475569' }}>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div style={{ padding: isMobile ? '1rem' : '1.25rem', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
                        <div style={{ position: 'relative', display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem' }}>
                            <input
                                type="text"
                                placeholder="Type your question..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage(searchTerm)}
                                style={{
                                    flex: 1,
                                    padding: isMobile ? '0.75rem 0.85rem' : '0.85rem 1rem',
                                    borderRadius: '16px',
                                    border: '1.5px solid #f1f5f9',
                                    outline: 'none',
                                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                                    background: '#f8fafc',
                                    transition: '0.2s'
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#1d3d6e'}
                                onBlur={e => e.currentTarget.style.borderColor = '#f1f5f9'}
                            />
                            <button
                                onClick={() => handleSendMessage(searchTerm)}
                                style={{
                                    width: isMobile ? '42px' : '46px',
                                    height: isMobile ? '42px' : '46px',
                                    background: '#1d3d6e',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: '0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Send size={isMobile ? 18 : 20} />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: isMobile ? '48px' : '54px',
                        height: isMobile ? '48px' : '54px',
                        background: 'linear-gradient(135deg, #1d3d6e 0%, #00aeef 100%)',
                        borderRadius: isMobile ? '15px' : '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 8px 30px rgba(0, 174, 239, 0.4)',
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        position: 'relative'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    }}
                >
                    <HelpCircle size={isMobile ? 20 : 24} />
                    <span style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-5px',
                        background: '#00aeef',
                        color: 'white',
                        fontSize: '9px',
                        fontWeight: 900,
                        padding: '3px 8px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        border: '2px solid white'
                    }}>
                        HELP
                    </span>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 0; }
                }
                @keyframes typingDot {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;
