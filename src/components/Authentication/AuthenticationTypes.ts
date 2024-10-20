/**
 * Interface representing the form data structure for user authentication.
 * 
 * @interface FormData
 * @property {string} [firstName] - The user's first name, optional.
 * @property {string} [lastName] - The user's last name, optional.
 * @property {string} [email] - The user's email address, required for login and signup.
 * @property {string} [password] - The user's password, required for login and signup.
 * @property {string} [confirmPassword] - The user's confirmation of their password, optional.
 * @property {string} [username] - The user's desired username, required for signup.
 */
export interface FormData {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    username?: string;
}