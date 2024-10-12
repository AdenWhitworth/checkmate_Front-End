import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, addDoc, setDoc } from 'firebase/firestore';
import { AuthContextType } from './AuthProviderTypes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginSelected, setIsLoginSelected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);

    if (!email || !password || email === "" || password === ''){
      setError("Email and password must not be empty.");
      return;
    }

    setLoadingAuth(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in");
    } catch (error: any) {
      setError("Incorrect username or password.");
    } finally {
      setLoadingAuth(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    setError(null);

    if (!email || !password || !username || email === "" || password === '' || username === ''){
      setError("Email, password, and username must not be empty.");
      return;
    }

    setLoadingAuth(true);

    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size === 0) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        SaveNewUser(user.uid, username, email);
      } else {
        setError("Username is already taken");
      }
    } catch (error: any) {
      setError("Incorrect username or password.");
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

  const SaveNewUser = async (uid: string, username: string, email: string) => {
    try {
      const docRef2 = doc(collection(db, "players"));

      const docRef = await addDoc(collection(db, "users"), {
        username: username,
        email: email,  
        uid: uid,
        playerID: docRef2.id,
        loss: 0,
        win: 0,
        rank: 0,
      });

      await setDoc(docRef2, {
        username: username,
        userID: docRef.id,    
      });

    } catch (e) {
      setCurrentUser(null);
      throw new Error("Unable to save new player");
    }
  }

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loadingAuth, logout, login, signup, error, resetError, isLoginSelected, setIsLoginSelected }}>
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


