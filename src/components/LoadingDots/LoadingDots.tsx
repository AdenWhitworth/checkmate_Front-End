import React from 'react';
import './LoadingDots.css';
import { LoadingDotsProps } from './LoadingDotsTypes';

/**
 * LoadingDots component displays an animated series of dots indicating a loading state.
 * The component is customizable in terms of position, color, and size using CSS classes.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.position - The position of the loading dots (e.g., "center", "left", "right").
 * @param {string} props.color - The color class applied to the loading dots (e.g., "grey", "black").
 * @param {string} props.size - The size class applied to the loading dots (e.g., "small", "medium").
 * 
 * @returns {JSX.Element} The rendered LoadingDots component.
 */

export default function LoadingDots({
    position,
    color,
    size
}: LoadingDotsProps): JSX.Element {

    return (
        <div className={`loading-dots position-${position}`} data-testid="loading-dots">
            <div className={`color-${color} size-${size}`}></div>
            <div className={`color-${color} size-${size}`}></div>
            <div className={`color-${color} size-${size}`}></div>
        </div>
    );
};