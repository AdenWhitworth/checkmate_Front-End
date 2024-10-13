import { User } from 'firebase/auth';

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
