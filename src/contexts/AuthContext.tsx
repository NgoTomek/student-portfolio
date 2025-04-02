import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
  UserCredential,
  sendEmailVerification,
  getIdTokenResult,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User } from '../types';
import { showSuccessToast, showErrorToast } from '../components/Toast';
import { handleError } from '../utils/errorUtils';

interface AuthState {
  currentUser: User | null;
  userProfile: Record<string, any> | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  signup: (email: string, password: string, displayName: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserData: (data: Record<string, any>) => Promise<void>;
  reloadUser: () => Promise<void>;
  verifyEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [state, setState] = useState<AuthState>({
    currentUser: null,
    userProfile: null,
    loading: false,
    initializing: true,
    error: null,
    isAdmin: false,
  });

  // Transform Firebase user to our User type
  const transformUser = (user: FirebaseUser): User => ({
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  });

  // Check if user has admin role
  const checkAdminRole = async (user: FirebaseUser): Promise<boolean> => {
    try {
      // Check custom claims first (more secure)
      const tokenResult = await getIdTokenResult(user);
      if (tokenResult.claims.admin === true) {
        return true;
      }

      // Fallback to Firestore check
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() && userDoc.data()?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  };

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Transform Firebase user to our User type
          const transformedUser = transformUser(user);
          
          // Check if user has admin role
          const isAdmin = await checkAdminRole(user);
          
          // Fetch user profile
          const profile = await fetchUserProfile(user.uid);
          
          setState({
            currentUser: transformedUser,
            userProfile: profile,
            loading: false,
            initializing: false,
            error: null,
            isAdmin,
          });
        } catch (error) {
          console.error('Error setting up auth state:', error);
          setState({
            currentUser: null,
            userProfile: null,
            loading: false,
            initializing: false,
            error: 'Failed to load user data',
            isAdmin: false,
          });
        }
      } else {
        setState({
          currentUser: null,
          userProfile: null,
          loading: false,
          initializing: false,
          error: null,
          isAdmin: false,
        });
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Sign up new user
  const signup = async (email: string, password: string, displayName: string): Promise<UserCredential> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: 'user',
      });
      
      // Create initial portfolio document
      await setDoc(doc(db, 'portfolios', user.uid), {
        uid: user.uid,
        personalInfo: {
          name: displayName,
          email: user.email,
        },
        isPublished: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      showSuccessToast('Account created successfully! Please verify your email.');
      return userCredential;
    } catch (error) {
      handleError(error, 'Failed to create account');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during signup' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Login existing user
  const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      const userRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
      
      return userCredential;
    } catch (error) {
      handleError(error, 'Failed to sign in');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during login' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Logout current user
  const logout = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await signOut(auth);
      showSuccessToast('Logged out successfully');
    } catch (error) {
      handleError(error, 'Failed to log out');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred during logout' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await sendPasswordResetEmail(auth, email);
      showSuccessToast('Password reset email sent. Check your inbox.');
    } catch (error) {
      handleError(error, 'Failed to send password reset email');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred sending reset email' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user signed in');
      
      // Update Firebase Auth profile
      await updateProfile(currentUser, { displayName, photoURL });
      
      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        displayName,
        photoURL,
        updatedAt: serverTimestamp(),
      });
      
      // Update state
      setState(prev => {
        if (!prev.currentUser) return prev;
        return {
          ...prev,
          currentUser: {
            ...prev.currentUser,
            displayName,
            photoURL,
          },
        };
      });
      
      showSuccessToast('Profile updated successfully');
    } catch (error) {
      handleError(error, 'Failed to update profile');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred updating profile' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Update user data in Firestore
  const updateUserData = async (data: Record<string, any>): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user signed in');
      
      // Update Firestore user document
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      
      // Update state with new profile data
      setState(prev => ({
        ...prev,
        userProfile: prev.userProfile ? { ...prev.userProfile, ...data } : null,
      }));
      
      showSuccessToast('User data updated successfully');
    } catch (error) {
      handleError(error, 'Failed to update user data');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred updating user data' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Reload user to get fresh data
  const reloadUser = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user signed in');
      
      // Reload user from Firebase
      await currentUser.reload();
      
      // Re-fetch user profile
      const profile = await fetchUserProfile(currentUser.uid);
      
      // Check admin status again
      const isAdmin = await checkAdminRole(currentUser);
      
      // Update state with fresh user data
      setState(prev => ({
        ...prev,
        currentUser: transformUser(currentUser),
        userProfile: profile,
        isAdmin,
        loading: false,
        error: null,
      }));
    } catch (error) {
      handleError(error, 'Failed to reload user data');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred reloading user' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  // Send email verification
  const verifyEmail = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user signed in');
      
      await sendEmailVerification(currentUser);
      showSuccessToast('Verification email sent! Check your inbox.');
    } catch (error) {
      handleError(error, 'Failed to send verification email');
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred sending verification' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const value: AuthContextType = {
    ...state,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updateUserData,
    reloadUser,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
