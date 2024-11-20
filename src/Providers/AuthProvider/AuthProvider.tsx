import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, writeBatch, Timestamp, updateDoc } from 'firebase/firestore';
import { AuthContextType } from './AuthProviderTypes';
import { updateEmail, verifyBeforeUpdateEmail, sendPasswordResetEmail } from "firebase/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component to provide authentication context to its children.
 *
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children components to wrap with the AuthProvider.
 * @returns {JSX.Element} The rendered AuthProvider component with authentication context.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginSelected, setIsLoginSelected] = useState<boolean>(true);

  /**
   * Effect to listen to authentication state changes and update context.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user){
        setCurrentUser((prev) => (prev !== user ? user : prev));
        if (user) {
          const token = await user.getIdToken();
          setAccessToken(token);
        }
        setLoadingAuth(false);
      } else {
        setLoadingAuth(false);
        setCurrentUser(null);
        setAccessToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * Effect to handle token refresh using `onIdTokenChanged`.
   */
  useEffect(() => {
    const unsubscribeTokenRefresh = auth.onIdTokenChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken(true);
        setAccessToken(token);
        setCurrentUser((prev) => (prev !== user ? user : prev));
      }
    });

    return () => unsubscribeTokenRefresh();
  }, []);

  /**
   * Validates input fields to ensure they are not empty.
   *
   * @param {string[]} fields - Array of field values to validate.
   * @returns {boolean} True if all fields are valid, otherwise false.
   */
  const validateInputs = (fields: string[]): boolean => {
    if (fields.some(field => !field || field.trim() === '')) {
      setError("Fields must not be empty.");
      return false;
    }
    return true;
  };

  /**
   * Logs in a user with email and password.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const login = async (email: string, password: string) => {
    setError(null);
    if (!validateInputs([email, password])) return;
    setLoadingAuth(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError("Incorrect email or password.");
    } finally {
      setLoadingAuth(false);
    }
  };

  /**
   * Signs up a new user with email, password, and username.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   * @param {string} username - The user's chosen username.
   */
  const signup = async (email: string, password: string, username: string) => {
    setError(null);
    if (!validateInputs([email, password, username])) return;
    setLoadingAuth(true);

    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.size === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveNewUser(userCredential.user.uid, username, email);
      } else {
        setError("Username is already taken.");
      }
    } catch (error: any) {
      setError("Failed to create user. Please try again.");
    } finally {
      setLoadingAuth(false);
    }
  };

  /**
   * Logs out the currently authenticated user.
   */
  const logout = async () => {
    setError(null);
    setLoadingAuth(true);

    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  /**
   * Saves a new user in the Firestore database.
   *
   * @param {string} uid - The user's unique ID.
   * @param {string} username - The user's chosen username.
   * @param {string} email - The user's email address.
   */
  const saveNewUser = async (uid: string, username: string, email: string) => {
    try {
      const batch = writeBatch(db);
      const userId = doc(collection(db, "users")).id;
      const playerId = doc(collection(db, "players")).id;
      const userDocRef = doc(db, "users", userId);
      const playerDocRef = doc(db, "players", playerId);

      batch.set(userDocRef, {
        username,
        email,
        uid,
        playerId,
        loss: 0,
        win: 0,
        draw: 0,
        gamesPlayed: 0,
        elo: 1200,
        createdAt: Timestamp.now(),
      });

      batch.set(playerDocRef, {
        username,
        userId,
        elo: 1200
      });
      
      await batch.commit();
    } catch (e) {
      setCurrentUser(null);
      setAccessToken(null);
      throw new Error("Unable to save new player.");
    }
  };

  /**
   * Updates the email address of the current user.
   *
   * @param {string} newEmail - The new email address to set for the user.
   */
  const updateUserEmail = async (newEmail: string, userId: string): Promise<boolean> => {
    if (!currentUser || !newEmail || newEmail.trim() === "" || !userId) {
      return Promise.reject(new Error("Invalid email, userId, or unauthenticated user."));
    }
  
    try {
      await verifyBeforeUpdateEmail(currentUser,newEmail);
      await updateEmail(currentUser, newEmail);
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { email: newEmail });
      setCurrentUser((prev) => (prev ? { ...prev, email: newEmail } : prev));
      return true;
    } catch (error) {
      return Promise.reject(error || new Error("Failed to update email."));
    }
  };

  /**
   * Sends a password reset email to the given address.
   *
   * @param {string} email - The email address of the user.
   * @returns {Promise<void>} Resolves if the email is successfully sent, rejects otherwise.
   */
  const forgotPassword = async (email: string): Promise<void> => {
    setError(null);
    if (!validateInputs([email])) return;
    setLoadingAuth(true);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setLoadingAuth(false);
    }
  };

  /**
   * Resets the error state.
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, logout, login, signup, error, resetError, isLoginSelected, setIsLoginSelected, accessToken, updateUserEmail, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 *
 * @returns {AuthContextType} The authentication context.
 * @throws {Error} If used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


