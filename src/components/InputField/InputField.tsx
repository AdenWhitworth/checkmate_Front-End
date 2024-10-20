import React, {useState} from 'react';
import './InputField.css';
import { InputFieldProps } from './InputFieldTypes';

/**
 * InputField component renders an interactive input field with a label, which supports focus styling and dynamic label positioning.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.label - The label text displayed above the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} props.type - The type attribute of the input field (e.g., text, email, password).
 * @param {string} [props.id] - Optional ID attribute for the input field.
 * @param {string} [props.value] - The current value of the input field.
 * @param {function} props.onChange - Callback function to handle value changes in the input field.
 * @param {boolean} [props.isRequired=false] - Indicates if the input field is required.
 * @param {boolean} [props.isSpellCheck=true] - Enables or disables the browser's spell check for the input field.
 * @param {boolean} [props.isDisabled=false] - Disables the input field if set to true.
 * 
 * @returns {JSX.Element} The rendered InputField component.
 */
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
}: InputFieldProps): JSX.Element {

    const [isFocused, setIsFocused] = useState(false);

    /**
     * Handles the focus event on the input field.
     */
    const handleFocus = () => setIsFocused(true);
    
    /**
     * Handles the blur event on the input field.
     */
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