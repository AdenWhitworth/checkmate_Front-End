import React from 'react';
import './ErrorLoading.css';
import { ErrorLoadingProps } from './ErrorLoadingTypes';
import exclamation from "../../Images/circle-exclamation.svg";

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