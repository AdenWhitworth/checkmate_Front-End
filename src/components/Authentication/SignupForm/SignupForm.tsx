import React from 'react';
import InputField from '../../InputField/InputField';
import Button from '../../Button/Button';
import { SignupFormProps } from './SignupFormTypes';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';

/**
 * SignupForm component handles the user registration form, allowing users to create a new account.
 * It contains input fields for username, email, and password.
 * The component also allows users to switch to the login form if they already have an account.
 * 
 * @component
 * @param {SignupFormProps} props - Props object for the SignupForm component.
 * @param {function} props.handleInputChange - Callback function to handle input changes for the form fields.
 * @returns {JSX.Element} The SignupForm component.
 */
export default function SignupForm({ 
    handleInputChange,
    handleSubmit
}: SignupFormProps): JSX.Element {
    const { loadingAuth, error, setIsLoginSelected } = useAuth();

    /**
     * Switches the view to the Login form when the user clicks "Login".
     */
    const switchToLogin = () => {
        setIsLoginSelected(true);
    };

    return (
        <form className='auth-form' onSubmit={handleSubmit} data-testid="signup-form">
            <h2>Create an account</h2>

            <InputField
                onChange={handleInputChange}
                name='username'
                isRequired
                type='text'
                label='Username'
                isSpellCheck={false}
                data-testid="username-input"
            />


            <InputField
                onChange={handleInputChange}
                name='email'
                isRequired
                type='email'
                label='Email'
                isSpellCheck={false}
                data-testid="email-input"
            />


            <InputField
                onChange={handleInputChange}
                name='password'
                isRequired
                type='password'
                label='Password'
                isSpellCheck={false}
                data-testid="password-input"
            />

            <Button type="submit" disabled={loadingAuth} styleType='primary'>
                {loadingAuth ? 'Creating...' : 'Create'}
            </Button>

            <p>
                Already have an account?{' '}
                <span onClick={switchToLogin} className='auth-selection'>
                    Login
                </span>
            </p>

            {error && <p className="error-message">{error}</p>}
        </form>
    );
}