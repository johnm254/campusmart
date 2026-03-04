import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../AppContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const BackButton = ({ label = 'Back', customAction = null }) => {
    const { setCurrentPage } = useApp();
    const isMobile = useMediaQuery('(max-width: 768px)');

    const handleBack = () => {
        if (customAction) {
            customAction();
        } else {
            // Go back to home by default
            setCurrentPage('home');
        }
    };

    return (
        <button
            onClick={handleBack}
            style={{
                background: 'none',
                border: 'none',
                color: 'var(--campus-blue)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: isMobile ? '0.5rem 0' : '0.75rem 0',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 700,
                transition: 'opacity 0.2s',
                marginBottom: isMobile ? '0.75rem' : '1rem'
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.7'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
            <ArrowLeft size={isMobile ? 18 : 20} />
            {label}
        </button>
    );
};

export default BackButton;
