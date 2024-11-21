import React from 'react';
import Button from '../../Button/Button';
import check from "../../../Images/circle-check yellow.svg";
import { SuccessPasswordFormProps } from './SuccessPasswordFormTypes';

/**
 * SuccessPasswordForm component for displaying a success message after a password reset.
 *
 * This component renders a confirmation message indicating the password reset was successful,
 * along with a button to proceed to the login page or next action.
 *
 * @param {SuccessPasswordFormProps} props - The props for the SuccessPasswordForm component.
 * @param {function} props.handleSubmit - Callback function to handle the form submission.
 *
 * @returns {JSX.Element} The SuccessPasswordForm component.
 */
export default function SuccessPasswordForm({
    handleSubmit
}: SuccessPasswordFormProps): JSX.Element {
    return (
        <form className="reset-password-form" onSubmit={handleSubmit}>
            <div className='reset-password-form-logo'>
                <img src={check} alt='Circle check'></img>
            </div>
            
            <h2>Password is reset</h2>

            <p>Please login again using the new password which was successfully changed.</p>

            <Button className='full-button' type="submit" styleType="primary">
                Continue
            </Button>
        </form>
    );
}