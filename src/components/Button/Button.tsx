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
}: ButtonProps) {

    const classType = { 
        primary: "button-fill", 
        secondary: "button-hollow",
    };

    const combinedClassName = `${classType[styleType]}${className ? ` ${className}` : ''}`;

    return (
        <button 
            className={combinedClassName} 
            onClick={onClick} 
            type={type}
            data-testid={testId} 
            disabled={disabled}
        >{children}</button>
    );
}