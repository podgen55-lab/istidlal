import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, nickname: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  toggleRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user profile from Firestore on auth change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        const userDocRef = doc(db, 'users', fbUser.uid);
        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            setUserProfile(snapshot.data() as UserProfile);
          } else {
            // First time login (e.g. via Google): create initial profile in Firestore
            const initialProfile: UserProfile = {
              id: fbUser.uid,
              nickname: fbUser.displayName || fbUser.email?.split('@')[0] || 'تلميذ استدلال',
              email: fbUser.email || '',
              role: 'student',
              streak: 1,
              xp: 50,
              level: 1,
              hearts: 5,
              classCode: 'BAC-2027-EX',
              avatar: '🧬',
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    nickname: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const userDocRef = doc(db, 'users', cred.user.uid);
      const newProfile: UserProfile = {
        id: cred.user.uid,
        nickname: nickname.trim() || 'تلميذ استدلال',
        email: email.trim(),
        role: role,
        streak: 1,
        xp: 50,
        level: 1,
        hearts: 5,
        classCode: 'BAC-2027-EX',
        avatar: '🧬',
      };
      await setDoc(userDocRef, newProfile);
      setUserProfile(newProfile);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      const updated = { ...userProfile, ...data };
      await updateDoc(userDocRef, data);
      setUserProfile(updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const addXP = async (amount: number) => {
    if (!currentUser || !userProfile) return;
    const newXP = userProfile.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;
    await updateProfile({ xp: newXP, level: newLevel });
  };

  const toggleRole = async () => {
    if (!userProfile) return;
    const nextRole: UserRole = userProfile.role === 'student' ? 'teacher' : 'student';
    await updateProfile({ role: nextRole });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateProfile,
        addXP,
        toggleRole,
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
