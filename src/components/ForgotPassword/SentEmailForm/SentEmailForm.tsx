import React from 'react';
import envelope from "../../../Images/envelope circle check yellow.svg";
import Button from '../../Button/Button';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import { SentEmailFormProps } from './SentEmailFormTypes';
import plane from "../../../Images/Paper Plane.svg";

/**
 * SentEmailForm component for displaying a confirmation message after a password reset email has been sent.
 *
 * This component informs the user to check their email for reset instructions and provides
 * an option to resend the email if needed.
 *
 * @param {SentEmailFormProps} props - The props for the SentEmailForm component.
 * @param {function} props.handleSubmit - Function to handle the form submission for resending the password reset email.
 *
 * @returns {JSX.Element} The SentEmailForm component.
 */
export default function SentEmailForm({
    handleSubmit
}: SentEmailFormProps): JSX.Element {
    const { loadingAuth, error } = useAuth();

    return (
        <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className='forgot-password-form-logo'>
                <img src={envelope} alt='Envelope check'></img>
            </div>
            
            <h2>Check your email</h2>

            <p>Please check the email address for instructions to reset your password.</p>

            <Button className='fixed-width-icon-button' type="submit" disabled={loadingAuth} styleType="primary" imgSrc={plane} imgAlt='Send plane'>
                {loadingAuth ? 'Resending...' : 'Resend Email'}
            </Button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}