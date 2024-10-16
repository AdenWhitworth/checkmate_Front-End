import React from 'react';
import './LoadingDots.css';
import { LoadingDotsProps } from './LoadingDotsTypes';

export default function LoadingDots({
    position,
    color,
    size
}: LoadingDotsProps) {

    return (
        <div className={`loading-dots position-${position}`} data-testid="loading-dots">
            <div className={`color-${color} size-${size}`}></div>
            <div className={`color-${color} size-${size}`}></div>
            <div className={`color-${color} size-${size}`}></div>
        </div>
    );
};