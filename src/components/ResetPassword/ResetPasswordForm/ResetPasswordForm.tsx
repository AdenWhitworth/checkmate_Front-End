import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import { ResetPasswordFormProps } from './ResetPasswordFormTypes';

/**
 * ResetPasswordForm component for handling the password reset input and submission.
 *
 * This component provides a form for users to input their new password and confirm it.
 * It validates the input and submits the form for password reset.
 *
 * @param {ResetPasswordFormProps} props - The props for the ResetPasswordForm component.
 * @param {function} props.handleInputChange - Callback to handle changes in input fields.
 * @param {function} props.handleSubmit - Callback to handle the form submission.
 *
 * @returns {JSX.Element} The ResetPasswordForm component.
 */
export default function ResetPasswordForm({
    handleInputChange,
    handleSubmit
}: ResetPasswordFormProps): JSX.Element {
    const { loadingAuth, error } = useAuth();

    return (
        <form className="reset-password-form" onSubmit={handleSubmit}>
            <h2>Reset your password</h2>

            <p>Enter a new password below to change your password.</p>

            <InputField
                onChange={handleInputChange}
                name="password"
                isRequired
                type="password"
                label="New password"
                isSpellCheck={false}
            />

            <InputField
                onChange={handleInputChange}
                name="confirmPassword"
                isRequired
                type="password"
                label="Re-enter new password"
                isSpellCheck={false}
            />

            <Button className='full-button' type="submit" disabled={loadingAuth} styleType="primary">
                {loadingAuth ? 'Resetting...' : 'Reset'}
            </Button>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}