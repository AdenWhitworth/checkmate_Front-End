import React, { useCallback, useState, useEffect } from 'react';
import "./UserDetailsForm.css";
import user from "../../../../Images/User Circle.svg";
import InputField from '../../../InputField/InputField';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';
import pencil from "../../../../Images/pencil-paper.svg";
import circleCheck from "../../../../Images/circle-check white.svg";
import { useAuth } from '../../../../Providers/AuthProvider/AuthProvider';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import { useNavigation } from '../../../../Hooks/useNavigation/useNavigation';

/**
 * UserDetailsForm component to manage and display user details, including editing email functionality.
 * 
 * @returns {JSX.Element} The rendered UserDetailsForm component.
 */
export default function UserDetailsForm(): JSX.Element {
    const [editForm, setEditForm] = useState<boolean>(false);
    const [newEmail, setNewEmail] = useState<string>("");
    const { playerDynamic, playerStatic } = usePlayer();
    const { updateUserEmail } = useAuth();
    const [loadingEditForm, setLoadingEditForm] = useState<boolean>(false);
    const { handleForgotPasswordClick } = useNavigation();

    /**
     * Handles form submission for editing the user's email.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handlEditFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!newEmail || newEmail.trim() === "" || !playerStatic) return;

        if(newEmail === playerDynamic?.email) {
            editFormToggle();
            return;
        }

        setLoadingEditForm(true);

        try {
            await updateUserEmail(newEmail, playerStatic.userId);
            editFormToggle();
        } catch (error) {
            console.error("Error updating email", error);
        } finally {
            setLoadingEditForm(false);
        }
    };

    /**
     * Toggles the edit mode for the form.
     */
    const editFormToggle = () => {
        setEditForm((prev) => !prev);
    }

    /**
     * Handles changes to the edit email field
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setNewEmail(value);
    }, []);

    /**
     * Effect to initialize the email field with the current user's email.
     */
    useEffect(() => {
        if(!playerDynamic) return;
        setNewEmail(playerDynamic.email);
    }, [playerDynamic]);

    return (
        <form className='details-form' onSubmit={handlEditFormSubmit}>
            <div className='edit'>
                {editForm? (
                    <button type='submit' className='edit-button'><img src={circleCheck} alt='Confirm edit user check'></img></button>
                ) : (
                    <img src={pencil} onClick={editFormToggle} alt='Edit user pencil'></img>
                )}
                
            </div>
            
            <div className='details'>
                <div className='details-img'>
                    <img src={user} alt='User icon'></img>
                </div>
                {playerStatic && playerDynamic && <h4>{`${playerStatic.username} (${playerDynamic.elo})`}</h4>}
            </div>
            
            {loadingEditForm? (
                <>
                    <LoadingSpinner></LoadingSpinner>
                    <p>Confirm new email address to save changes.</p>
                </>
            ) : (
                <>
                    <InputField
                        value={newEmail}
                        onChange={handleInputChange}
                        name='Email'
                        type='text'
                        label='Email'
                        isRequired={editForm}
                        isDisabled={!editForm}
                        isSpellCheck={false}
                    />

                    <p>
                        <span
                            className='forgot'
                            onClick={handleForgotPasswordClick}
                        >
                            Forgot Password?
                        </span>
                    </p>
                </>
            )}
        </form>
    );
}