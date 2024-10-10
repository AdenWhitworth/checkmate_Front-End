import React from 'react';
import './Button.css';
import { ButtonProps } from './ButtonTypes';

export default function Button({ 
    children, 
    styleType, 
    onClick, 
    type = 'button', 
    className = '', 
    disabled = false,
    testId,
    imgSrc,
    imgAlt,
    id,
    name,
}: ButtonProps) {

    const classType = { 
        primary: imgSrc? "button-primary-icon" : "button-primary", 
        secondary: imgSrc? "button-secondary-icon" : "button-secondary",
    };

    const combinedClassName = `${classType[styleType]}${className ? ` ${className}` : ''}`;

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