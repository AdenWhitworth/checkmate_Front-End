import React, { useState, useCallback } from 'react';
import king_logo from '../../Images/King Logo White.svg';
import "./ResetPassword.css";
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';
import { FormData } from './ResetPasswordTypes';
import ResetPasswordForm from './ResetPasswordForm/ResetPasswordForm';
import SuccessPasswordForm from './SuccessPasswordForm/SuccessPasswordForm';

/**
 * ResetPassword component for handling the password reset process.
 *
 * This component allows users to reset their password by providing a new password and confirming it.
 * It validates the password reset request using an `oobCode` obtained from the query parameters.
 * Upon successful password reset, it displays a success message and allows the user to navigate to the login page.
 * 
 * @returns {JSX.Element} The ResetPassword component.
 */
export default function ResetPassword(): JSX.Element {
    const { handleKingClick, handleLoginClick } = useNavigation();
    const { resetPassword, currentUser, logout } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        password: "",
        confirmPassword: ""
    });
    const [isReset, setIsReset] = useState<boolean>(false);
    const queryParams = new URLSearchParams(window.location.search);
    const oobCode = queryParams.get("oobCode");

    /**
     * Handles form submission for the reset password form.
     *
     * Submits the new password and confirmation password to reset the user's password. 
     * Logs out the user if they are currently authenticated, then displays a success message.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     * @returns {Promise<void>} A promise that resolves when the password reset process is complete.
     */
    const handleResetPasswordSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await resetPassword( oobCode || '', formData.password || '', formData.confirmPassword || '');
            if(currentUser){
                logout();
            }
            setIsReset(true);
        } catch (error){
            console.error("Error occured with reset password:", error);
        }
    }, [currentUser, formData, logout, oobCode, resetPassword]);

    /**
     * Handles changes to input fields in the reset password form.
     *
     * Updates the state with the new values for the password and confirm password fields.
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

    return (
        <section className='reset-password'>
            <div className='reset-password-content'>
                <div className='reset-password-logo'>
                    <img 
                        onClick={handleKingClick} 
                        className='reset-password-logo-img' 
                        src={king_logo} 
                        alt='King Logo'
                    />
                </div>

                {isReset? (
                    <SuccessPasswordForm
                        handleSubmit={handleLoginClick}
                    ></SuccessPasswordForm>
                ):(
                    <ResetPasswordForm
                        handleSubmit={handleResetPasswordSubmit}
                        handleInputChange={handleInputChange}
                    ></ResetPasswordForm>
                )}
            </div>
        </section>
    );
}