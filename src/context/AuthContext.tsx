import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type FirebaseUser = any;

export interface UserProfile {
  id: string;
  firebaseUid: string;
  name: string;
  email: string;
  photoURL?: string;
  currency: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  demoUser: UserProfile | null;
  loading: boolean;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  setDemoMode: (enable: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    // Default to demo mode if VITE_FIREBASE_API_KEY is not configured
    return !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY === 'demo-api-key';
  });

  const [demoUser, setDemoUser] = useState<UserProfile | null>({
    id: 'usr_1',
    firebaseUid: 'user_demo_123',
    name: 'Swastik',
    email: 'swastik@example.com',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    currency: 'INR',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        setUser(fbUser);
        setIsDemoMode(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      if (isDemoMode) {
        setDemoUser({
          id: 'usr_1',
          firebaseUid: 'user_demo_123',
          name: 'Swastik',
          email: 'swastik@example.com',
          photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          currency: 'INR',
        });
        return;
      }
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.warn('Google login fallback to demo mode:', err);
      setIsDemoMode(true);
      setDemoUser({
        id: 'usr_1',
        firebaseUid: 'user_demo_123',
        name: 'Swastik',
        email: 'swastik@example.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        currency: 'INR',
      });
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      if (isDemoMode) {
        setDemoUser({
          id: 'usr_1',
          firebaseUid: 'user_demo_123',
          name: email.split('@')[0] || 'Swastik',
          email,
          currency: 'INR',
        });
        return;
      }
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.warn('Email login fallback:', err);
      setDemoUser({
        id: 'usr_1',
        firebaseUid: 'user_demo_123',
        name: email.split('@')[0] || 'Swastik',
        email,
        currency: 'INR',
      });
      setIsDemoMode(true);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      if (isDemoMode) {
        setDemoUser({
          id: `usr_${Date.now()}`,
          firebaseUid: `user_${Date.now()}`,
          name: email.split('@')[0] || 'User',
          email,
          currency: 'INR',
        });
        return;
      }
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      console.warn('Signup fallback:', err);
      setIsDemoMode(true);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      // Ignore
    }
    setUser(null);
    setDemoUser(null);
  };

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      try {
        return await user.getIdToken();
      } catch (err) {
        console.error('Failed to get Firebase token:', err);
      }
    }
    if (demoUser) {
      return `dev_token_${demoUser.firebaseUid}`;
    }
    return null;
  };

  const setDemoMode = (enable: boolean) => {
    setIsDemoMode(enable);
    if (enable && !demoUser) {
      setDemoUser({
        id: 'usr_1',
        firebaseUid: 'user_demo_123',
        name: 'Swastik',
        email: 'swastik@example.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        currency: 'INR',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        demoUser,
        loading,
        isDemoMode,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        getIdToken,
        setDemoMode,
      }}
    >
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
