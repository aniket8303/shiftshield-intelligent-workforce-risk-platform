import React from 'react';

export default function Placeholder({ title }) {
    return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>This module is currently under construction in the ShiftShield Enterprise platform.</p>
        </div>
    );
}
