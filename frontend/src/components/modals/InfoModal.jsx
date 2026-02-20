import React from 'react';
import { X } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{ zIndex: 600000 }}>
            <div className="modal-content" style={{ maxWidth: '800px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
                <div className="modal-header" style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--campus-blue)' }}>{title}</h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>

                <div className="info-content" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)' }}>
                    {content}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <button className="btn btn-primary" onClick={onClose}>Understood</button>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
