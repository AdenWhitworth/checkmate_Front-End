/**
 * Interface representing the form data structure for reset password.
 * 
 * @interface FormData
 * @property {string} [password] - New password the user is resetting to.
 * @property {string} [confirmPassword] - Confirming the new password the user is resetting to.
 */
export interface FormData {
    password: string;
    confirmPassword: string;
}