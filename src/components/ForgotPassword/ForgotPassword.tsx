import React, { useState, useCallback } from 'react';
import king_logo from '../../Images/King Logo White.svg';
import "./ForgotPassword.css";
import { FormData } from './ForgotPasswordTypes';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';
import ForgotPasswordForm from './ForgotPasswordForm/ForgotPasswordForm';
import SentEmailForm from './SentEmailForm/SentEmailForm';

/**
 * ForgotPassword component for handling the password recovery process.
 *
 * This component allows users to request a password reset by providing their email address. 
 * It displays a form to enter the email and shows a confirmation message once the reset email is sent.
 *
 * @returns {JSX.Element} The ForgotPassword component.
 */
export default function ForgotPassword(): JSX.Element {
    const { handleKingClick } = useNavigation();
    const { forgotPassword, currentUser, logout } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        email: '',
    });
    const [emailSent, setEmailSent] = useState<boolean>(false);

    /**
     * Handles changes to input fields in the forgot password form.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     * @returns {void}
     */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    }, []);

    /**
     * Handles form submission for the forgot password form.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>} A promise that resolves when the forgot password process is complete.
     */
    const handleForgotPasswordSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await forgotPassword(formData.email || '');
            if(currentUser){
                logout();
            }
            setEmailSent(true);
        } catch (error){
            console.error("Error occured with forgot password:", error);
        }
    }, [currentUser, forgotPassword, formData, logout]);

    return (
        <section className='forgot-password'>
            <div className='forgot-password-content'>
                <div className='forgot-password-logo'>
                    <img 
                        onClick={handleKingClick} 
                        className='forgot-password-logo-img' 
                        src={king_logo} 
                        alt='King Logo'
                    />
                </div>

                {emailSent? (
                    <SentEmailForm
                        handleSubmit={handleForgotPasswordSubmit}
                    ></SentEmailForm>
                ):(
                    <ForgotPasswordForm 
                        handleInputChange={handleInputChange}
                        handleSubmit={handleForgotPasswordSubmit}
                    />
                )}
            </div>
        </section>
    );
}