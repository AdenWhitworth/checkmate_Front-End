import React, { useState, useEffect, useCallback } from 'react';
import king_logo from '../../Images/King Logo White.svg';
import "./Authentication.css";
import LoginForm from './LoginForm/LoginForm';
import SignupForm from './SignupForm/SignupForm';
import { FormData } from './AuthenticationTypes';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';

/**
 * Renders the Authentication component, which includes login and signup forms.
 * @component
 * @returns {JSX.Element} The rendered Authentication component.
 */
export default function Authentication(): JSX.Element {
    const { handleKingClick, handleSendToDashboard } = useNavigation();
    const { currentUser, resetError, login, signup, isLoginSelected } = useAuth();
    
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        username: ''
    });

    /**
     * Handles changes to input fields in the login or signup form.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    }, []);

    /**
     * Handles form submission for the login form.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleLoginSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(formData.email || '', formData.password || '');
    }, [login, formData.email, formData.password]);

    /**
     * Handles form submission for the signup form.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleSignUpSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signup(formData.email || '', formData.password || '', formData.username || '');
    }, [signup, formData.email, formData.password, formData.username]);

    /**
     * Resets error messages when switching between login and signup forms.
     */
    useEffect(() => {
        resetError();
    }, [isLoginSelected, resetError]);

    /**
     * Navigates to the dashboard when a user is successfully logged in.
     */
    useEffect(() => {
        if (currentUser) {
            handleSendToDashboard();
        }
    }, [currentUser, handleSendToDashboard]);

    return (
        <section className='auth' data-testid="auth-section">
            <div className='auth-content'>
                <div className='auth-logo'>
                    <img 
                        onClick={handleKingClick} 
                        className='auth-logo-img' 
                        src={king_logo} 
                        alt='King Logo'
                    />
                </div>

                {isLoginSelected ? (
                    <LoginForm 
                        handleInputChange={handleInputChange}
                        handleSubmit={handleLoginSubmit}
                    />
                ) : (
                    <SignupForm
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSignUpSubmit}
                    />
                )}
            </div>
        </section>
    );
}
