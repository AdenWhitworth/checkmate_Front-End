import { User } from 'firebase/auth';

/**
 * Interface representing the authentication context type.
 *
 * @interface AuthContextType
 * 
 * @property {User | null} currentUser - The currently authenticated user, or `null` if not authenticated.
 * @property {boolean} loadingAuth - Indicates whether authentication-related operations are in progress.
 * @property {string | null} error - The error message related to authentication operations, or `null` if there is no error.
 * 
 * @property {Function} login - Logs in a user with the provided email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} A promise that resolves when the login operation is complete.
 * 
 * @property {Function} signup - Signs up a new user with the provided email, password, and username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} username - The user's chosen username.
 * @returns {Promise<void>} A promise that resolves when the signup operation is complete.
 * 
 * @property {Function} logout - Logs out the currently authenticated user.
 * @returns {void} A function that performs the logout operation.
 * 
 * @property {Function} resetError - Resets the error state in the authentication context.
 * @returns {void} A function that clears the error state.
 * 
 * @property {boolean} isLoginSelected - Indicates whether the login form is currently selected.
 * 
 * @property {Function} setIsLoginSelected - Sets whether the login form is selected.
 * @param {boolean} value - The boolean value to set for `isLoginSelected`.
 * @returns {void} A function to update the `isLoginSelected` state.
 * 
 * @property {string | null} accessToken - The access token of the currently authenticated user, or `null` if not available.
 * 
 * @property {Function} updateUserEmail - Updates the email address of the authenticated user.
 * @param {string} newEmail - The new email address to update.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the email update succeeds, otherwise rejects with an error.
 * 
 * @property {Function} forgotPassword - Sends a password reset email to the user.
 * @param {string} email - The email address of the user to send the reset instructions.
 * @returns {Promise<void>} A promise that resolves when the reset email has been sent.
 * 
 * @property {Function} resetPassword - Resets the user's password with a confirmation code and new credentials.
 * @param {string} oobCode - The out-of-band code from the password reset email.
 * @param {string} password - The new password to set for the user.
 * @param {string} confirmPassword - Confirmation of the new password to ensure they match.
 * @returns {Promise<void>} A promise that resolves when the password has been successfully reset, otherwise rejects with an error.
 */
export interface AuthContextType {
    currentUser: User | null;
    loadingAuth: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, username: string) => Promise<void>;
    logout: () => void;
    resetError: () => void;
    isLoginSelected: boolean;
    setIsLoginSelected: (value: boolean) => void;
    accessToken: string | null;
    updateUserEmail: (newEmail: string, userId: string) => Promise<boolean>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (oobCode: string, password: string, confirmPassword: string) => Promise<void>;
}