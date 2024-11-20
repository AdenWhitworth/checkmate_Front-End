import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { LoginFormProps } from './LoginFormTypes';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from '../../../Hooks/useNavigation/useNavigation';

/**
 * LoginForm component allows users to enter their email and password to sign in.
 * Provides a form with input fields for the email and password, and a button to submit the form.
 * It also includes an option to switch to the signup form if the user doesn't have an account.
 * 
 * @component
 * @param {LoginFormProps} props - The props for the LoginForm component.
 * @param {function} props.handleInputChange - A function to handle changes in the input fields.
 * @param {function} props.handleSubmit - A function to handle form submission.
 * 
 * @returns {JSX.Element} A form for logging in users with fields for email and password.
 */
export default function LoginForm({
    handleInputChange,
    handleSubmit
}: LoginFormProps): JSX.Element {
    const { loadingAuth, error, setIsLoginSelected } = useAuth();
    const { handleForgotPasswordClick } = useNavigation();

    /**
     * Switches the form view to the signup form.
     */
    const switchToSignUp = () => {
        setIsLoginSelected(false);
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Welcome back</h2>

            <InputField
                onChange={handleInputChange}
                name="email"
                isRequired
                type="email"
                label="Email"
                isSpellCheck={false}
            />

            <InputField
                onChange={handleInputChange}
                name="password"
                isRequired
                type="password"
                label="Password"
                isSpellCheck={false}
            />

            <p><span onClick={handleForgotPasswordClick} className="auth-selection">Forgot Password?</span></p>

            <Button type="submit" disabled={loadingAuth} styleType="primary">
                {loadingAuth ? 'Signing In...' : 'Sign In'}
            </Button>

            <p>
                Don’t have an account?{' '}
                <span onClick={switchToSignUp} className="auth-selection">
                    Sign Up
                </span>
            </p>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}