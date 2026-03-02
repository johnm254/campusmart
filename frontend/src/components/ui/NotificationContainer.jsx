import React, { useState } from 'react';
import { X, Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../../AppContext';

const Notification = ({ notification }) => {
    const { id, title, message, type, icon } = notification;
    const { removeNotification } = useApp();

    const typeConfig = {
        success: { color: 'var(--jiji-green)', Icon: CheckCircle },
        info: { color: 'var(--campus-blue)', Icon: Info },
        warning: { color: 'var(--jiji-orange)', Icon: AlertTriangle }
    };

    const { color, Icon } = typeConfig[type] || typeConfig.info;

    return (
        <div
            style={{
                background: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                minWidth: '300px',
                borderLeft: `5px solid ${color}`,
                animation: 'slideIn 0.4s ease-out forwards',
                position: 'relative'
            }}
        >
            <div style={{ color }}>
                <Icon size={20} />
            </div>
            <div style={{ flex: 1, paddingRight: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{title}</h4>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{message}</p>
            </div>
            <button
                onClick={() => removeNotification(id)}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: '#888',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                }}
                className="hover-bg-light"
            >
                <X size={14} />
            </button>
        </div>
    );
};

const NotificationContainer = () => {
    const { notifications } = useApp();

    return (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map(n => (
                <Notification key={n.id} notification={n} />
            ))}
        </div>
    );
};

export default NotificationContainer;
