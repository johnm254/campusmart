import React from 'react';

/**
 * Accessibility Enhancement Component
 * Provides screen reader announcements and keyboard navigation support
 */

export const ScreenReaderAnnouncement = ({ message, priority = 'polite' }) => {
    return (
        <div
            role="status"
            aria-live={priority}
            aria-atomic="true"
            className="sr-only"
            style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                border: '0'
            }}
        >
            {message}
        </div>
    );
};

export const SkipToContent = () => {
    return (
        <a
            href="#main-content"
            className="skip-to-content"
            style={{
                position: 'absolute',
                top: '-40px',
                left: '6px',
                background: '#1d4ed8',
                color: 'white',
                padding: '8px',
                textDecoration: 'none',
                borderRadius: '4px',
                zIndex: 9999,
                fontSize: '14px',
                fontWeight: '600'
            }}
            onFocus={(e) => {
                e.target.style.top = '6px';
            }}
            onBlur={(e) => {
                e.target.style.top = '-40px';
            }}
        >
            Skip to main content
        </a>
    );
};

export const AccessibleButton = ({ 
    children, 
    onClick, 
    ariaLabel, 
    disabled = false, 
    className = '', 
    ...props 
}) => {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            disabled={disabled}
            className={`accessible-button ${className}`}
            style={{
                minHeight: '44px', // WCAG minimum touch target
                minWidth: '44px',
                ...props.style
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export const AccessibleLink = ({ 
    children, 
    href, 
    ariaLabel, 
    external = false, 
    className = '', 
    ...props 
}) => {
    return (
        <a
            href={href}
            aria-label={ariaLabel}
            className={`accessible-link ${className}`}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            style={{
                minHeight: '44px', // WCAG minimum touch target
                display: 'inline-flex',
                alignItems: 'center',
                ...props.style
            }}
            {...props}
        >
            {children}
            {external && (
                <span className="sr-only"> (opens in new window)</span>
            )}
        </a>
    );
};

export default {
    ScreenReaderAnnouncement,
    SkipToContent,
    AccessibleButton,
    AccessibleLink
};