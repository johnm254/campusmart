import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageSquare } from 'lucide-react';

const responses = {
    greetings: ["Hello Comrade! I'm MartBot, your campus marketplace assistant. How can I help you today?", "Habari! Ready to find some great deals on campus?"],
    safety: ["Safety First! NEVER pay before seeing the item. Meet in public campus areas or at well-lit spots near the gate."],
    selling: ["To sell, click the SELL button. Pro tip: Good photos help items sell faster!"],
    default: ["I'm not sure about that. Try asking about safety, selling, or locations!"]
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm MartBot. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userText = input.trim();
        setMessages([...messages, { text: userText, isBot: false }]);
        setInput('');

        // Logic for bot response
        setTimeout(() => {
            let botResponse = responses.default[0];
            const lowerInput = userText.toLowerCase();

            if (lowerInput.includes('hi') || lowerInput.includes('hello')) botResponse = responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
            else if (lowerInput.includes('safe') || lowerInput.includes('scam')) botResponse = responses.safety[0];
            else if (lowerInput.includes('sell')) botResponse = responses.selling[0];

            setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
        }, 500);
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9000 }}>
            {isOpen ? (
                <div style={{ width: '350px', height: '500px', background: 'white', borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ background: 'var(--campus-blue)', color: 'white', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bot size={20} /> MartBot AI</h3>
                        <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>
                    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: '#f8f9fa', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                maxWidth: '80%',
                                padding: '0.75rem 1rem',
                                borderRadius: '15px',
                                fontSize: '0.9rem',
                                alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                background: msg.isBot ? 'white' : 'var(--campus-blue)',
                                color: msg.isBot ? 'var(--text-primary)' : 'white',
                                boxShadow: msg.isBot ? '0 2px 5px rgba(0,0,0,0.05)' : 'none'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '0.6rem 1rem', outline: 'none' }}
                        />
                        <button onClick={handleSend} style={{ background: 'var(--campus-blue)', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => setIsOpen(true)}
                    style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--campus-blue), #00aeef)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', boxShadow: '0 10px 25px rgba(29, 61, 110, 0.3)' }}
                >
                    <MessageSquare size={24} />
                </div>
            )}
        </div>
    );
};

export default Chatbot;
