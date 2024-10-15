import React from 'react';
import './LoadingDots.css';

export default function LoadingDots () {

    return (
        <div className="loading-dots" data-testid="loading-dots">
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};