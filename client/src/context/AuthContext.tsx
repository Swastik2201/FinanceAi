import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { syncUserProfile } from '../services/authService';
import { DbUser, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const mapFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password must contain at least 8 characters.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign in cancelled.';
      case 'auth/network-request-failed':
        return 'Something went wrong. Please check your connection and try again.';
      default:
        return err?.message || 'Authentication failed. Please check your details and try again.';
    }
  };

  // Sync user with backend database
  const handleUserSync = async (fbUser: FirebaseUser, fullName?: string, providerName?: string) => {
    try {
      const syncedUser = await syncUserProfile({
        name: fullName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL,
        provider: providerName || fbUser.providerData[0]?.providerId || 'password',
      });
      setUser(syncedUser);
    } catch (syncErr) {
      console.warn('Backend sync failed, generating fallback user session:', syncErr);
      // Fallback local session state if backend endpoint is unavailable
      const fallbackUser: DbUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        name: fullName || fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL,
        provider: providerName || 'password',
        currency: 'USD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(fallbackUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        await handleUserSync(fbUser);
      } else {
        // Check for dev mock session
        const mockUserStr = localStorage.getItem('mock_user_session');
        if (mockUserStr) {
          try {
            setUser(JSON.parse(mockUserStr));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleUserSync(userCredential.user);
    } catch (err: any) {
      // Dev mode fallback login if live Firebase project is not configured with actual email user
      if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key') {
        console.warn('Using dev mock login due to placeholder Firebase config');
        const mockUser: DbUser = {
          id: 'dev-user-id-1',
          firebaseUid: 'dev-firebase-uid-1',
          name: email.split('@')[0],
          email,
          photoURL: null,
          provider: 'password',
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
        localStorage.setItem('mock_auth_token', 'mock_token_dev-user-id-1_' + email);
        setUser(mockUser);
        return;
      }

      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      await handleUserSync(userCredential.user, name, 'password');
    } catch (err: any) {
      if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key') {
        console.warn('Using dev mock register due to placeholder Firebase config');
        const mockUser: DbUser = {
          id: 'dev-user-id-' + Date.now(),
          firebaseUid: 'dev-firebase-uid-' + Date.now(),
          name,
          email,
          photoURL: null,
          provider: 'password',
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
        localStorage.setItem('mock_auth_token', 'mock_token_' + mockUser.id + '_' + email);
        setUser(mockUser);
        return;
      }

      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleUserSync(result.user, undefined, 'google.com');
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        const msg = 'Google sign in was cancelled.';
        setError(msg);
        throw new Error(msg);
      }

      if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key') {
        console.warn('Using dev mock Google sign-in');
        const mockUser: DbUser = {
          id: 'dev-google-user-1',
          firebaseUid: 'dev-google-uid-1',
          name: 'Google Demo User',
          email: 'google.user@example.com',
          photoURL: 'https://lh3.googleusercontent.com/a/default-user',
          provider: 'google.com',
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
        localStorage.setItem('mock_auth_token', 'mock_token_dev-google-user-1_google.user@example.com');
        setUser(mockUser);
        return;
      }

      const friendlyMsg = 'Unable to sign in with Google. Please try again.';
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const loginAsGuest = async (): Promise<void> => {
    setError(null);
    try {
      const result = await signInAnonymously(auth);
      await handleUserSync(result.user, 'Guest User', 'guest');
    } catch (err: any) {
      if (
        err?.code === 'auth/api-key-not-valid' ||
        err?.code === 'auth/invalid-api-key' ||
        err?.code === 'auth/admin-restricted-operation' ||
        err?.code === 'auth/operation-not-allowed'
      ) {
        console.warn('Using dev mock Guest sign-in');
        const guestId = 'guest-' + Math.random().toString(36).substring(2, 8);
        const mockUser: DbUser = {
          id: guestId,
          firebaseUid: 'guest-uid-' + guestId,
          name: 'Guest User',
          email: `${guestId}@guest.local`,
          photoURL: null,
          provider: 'guest',
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem('mock_user_session', JSON.stringify(mockUser));
        localStorage.setItem('mock_auth_token', `mock_token_${mockUser.id}_${mockUser.email}`);
        setUser(mockUser);
        return;
      }

      const friendlyMsg = 'Unable to sign in as Guest. Please try again.';
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const logout = async (): Promise<void> => {
    setError(null);
    try {
      localStorage.removeItem('mock_user_session');
      localStorage.removeItem('mock_auth_token');
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      setError('Failed to log out. Please try again.');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (err?.code === 'auth/api-key-not-valid' || err?.code === 'auth/invalid-api-key') {
        // Dev mock password reset success
        return;
      }
      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        loginAsGuest,
        logout,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
