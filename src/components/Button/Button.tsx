import React from 'react';
import './Button.css';
import { ButtonProps } from './ButtonTypes';

/**
 * Button component to render a styled button with optional icon.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The text or element to be displayed inside the button.
 * @param {'primary' | 'secondary'} props.styleType - The style type of the button, determines the button's appearance.
 * @param {() => void} [props.onClick] - Optional onClick handler function for the button.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The type attribute for the button element.
 * @param {string} [props.className=''] - Optional additional CSS classes for the button.
 * @param {boolean} [props.disabled=false] - Boolean to disable the button.
 * @param {string} [props.testId] - Optional test ID for testing purposes.
 * @param {string} [props.imgSrc] - Optional image source URL to show an icon in the button.
 * @param {string} [props.imgAlt=''] - Alt text for the button icon.
 * @param {string} [props.id] - Optional id for the button element.
 * @param {string} [props.name] - Optional name attribute for the button element.
 * 
 * @returns {JSX.Element} - The rendered Button component.
 */
export default function Button({ 
    children, 
    styleType, 
    onClick, 
    type = 'button', 
    className = '', 
    disabled = false,
    testId,
    imgSrc,
    imgAlt = '',
    id,
    name,
}: ButtonProps): JSX.Element {
    const classType = imgSrc ? `button-${styleType}-icon` : `button-${styleType}`;
    const combinedClassName = `${classType}${className ? ` ${className}` : ''}`;

    return (
        <button 
            className={combinedClassName} 
            onClick={onClick} 
            type={type}
            data-testid={testId} 
            disabled={disabled}
            id={id}
            name={name}
        >
            {imgSrc && <img src={imgSrc} alt={imgAlt} className="button-icon" />}
            {children}
        </button>
    );
}