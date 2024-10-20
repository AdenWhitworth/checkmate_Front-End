import { User } from 'firebase/auth';

/**
 * Interface representing the authentication context type.
 *
 * @interface AuthContextType
 * @property {User | null} currentUser - The currently authenticated user, or null if not authenticated.
 * @property {boolean} loadingAuth - Indicates whether authentication-related operations are in progress.
 * @property {string | null} error - The error message related to authentication operations, or null if there is no error.
 * @property {function} login - Logs in a user with the provided email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<void>} A promise that resolves when the login operation is complete.
 * @property {function} signup - Signs up a new user with the provided email, password, and username.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} username - The user's chosen username.
 * @returns {Promise<void>} A promise that resolves when the signup operation is complete.
 * @property {function} logout - Logs out the currently authenticated user.
 * @property {function} resetError - Resets the error state in the authentication context.
 * @property {boolean} isLoginSelected - Indicates whether the login form is currently selected.
 * @property {function} setIsLoginSelected - Sets whether the login form is selected.
 * @param {boolean} value - The boolean value to set for `isLoginSelected`.
 * @property {string | null} accessToken - The access token of the currently authenticated user, or null if not available.
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
}

