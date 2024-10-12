import React, {useState} from 'react';
import './InputField.css';
import { InputFieldProps } from './InputFieldTypes';

export default function InputField({
    label,
    name,
    type,
    id,
    value,
    onChange,
    isRequired,
    isSpellCheck,
    isDisabled,
}: InputFieldProps) {

    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        if (value === '') {
            setIsFocused(false);
        }
    };
    
    return (
        <div className={`input-container ${isFocused || value ? 'active' : ''}`}>
            <label className="input-label">{label}</label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                name={name}
                required={isRequired}
                spellCheck={isSpellCheck}
                disabled={isDisabled} 
                id={id}
            />
        </div>
    );
}