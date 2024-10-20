import React from 'react';
import './ErrorLoading.css';
import { ErrorLoadingProps } from './ErrorLoadingTypes';
import exclamation from "../../Images/circle-exclamation.svg";

/**
 * ErrorLoading component that displays an error message with an accompanying icon.
 * It provides visual feedback when an error occurs during loading.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.message - The error message to be displayed.
 * @returns {JSX.Element} The rendered ErrorLoading component.
 */
export default function ErrorLoading({
    message,
}: ErrorLoadingProps): JSX.Element {
    return (
        <div className='loading-error'>
            <img className='loading-error-img' src={exclamation} alt='Exclamation Icon'></img>
            <h4 className='loading-error-txt'>{message}</h4>
        </div>
    );
}