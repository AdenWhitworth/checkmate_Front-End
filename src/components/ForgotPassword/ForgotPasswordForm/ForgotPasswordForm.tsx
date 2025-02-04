import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { ForgotPasswordFormProps } from './ForgotPasswordFormTypes';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import plane from "../../../Images/Paper Plane.svg";

/**
 * ForgotPasswordForm component for rendering the password reset form.
 *
 * This component allows users to input their email address and submit the form
 * to receive password reset instructions. It includes an input field, a button,
 * and error handling for displaying any issues during the process.
 *
 * @component
 *
 * @param {ForgotPasswordFormProps} props - The props for the ForgotPasswordForm component.
 * @param {function} props.handleInputChange - Function to handle input changes in the email field.
 * @param {function} props.handleSubmit - Function to handle form submission for password reset.
 *
 * @returns {JSX.Element} The ForgotPasswordForm component.
 */
export default function ForgotPasswordForm({
    handleInputChange,
    handleSubmit
}: ForgotPasswordFormProps): JSX.Element {
    const { loadingAuth, error } = useAuth();

    return (
        <form 
            className="forgot-password-form" 
            onSubmit={handleSubmit}
            data-testid="forgot-password-form"
        >
            <h2>Reset your password</h2>

            <p>Enter your Email address and we will send you instructions to reset your password.</p>

            <InputField
                onChange={handleInputChange}
                name="email"
                isRequired
                type="email"
                label="Email"
                isSpellCheck={false}
            />

            <Button className='full-button' type="submit" disabled={loadingAuth} styleType="primary" imgSrc={plane} imgAlt='Send plane'>
                {loadingAuth ? 'Sending...' : 'Send Email'}
            </Button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}