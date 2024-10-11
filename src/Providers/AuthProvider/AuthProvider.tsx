import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AuthContextType } from './AuthProviderTypes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoadingAuth(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setLoadingAuth(true);
    setError(null);
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Save new user", user.uid, username);
      } else {
        setError("Username is already taken");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  const logout = async () => {
    setLoadingAuth(true);
    setError(null);
    try {
      await signOut(auth);
      console.log("Signed out");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, logout, login, signup, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


