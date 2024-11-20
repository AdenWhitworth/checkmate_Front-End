/**
 * Interface representing the form data structure for forgot password.
 * 
 * @interface FormData
 * @property {string} [email] - The user's email address, required for password reset.
 */
export interface FormData {
    email: string;
}