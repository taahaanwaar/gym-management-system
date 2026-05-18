import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, googleProvider } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  guestLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isGuest) return; // Ignore firebase auth changes if in guest mode
      
      setUser(user);
      if (user) {
        // ... (existing profile fetching logic)
        // Try to fetch profile from staff first, then members
        const staffDoc = await getDoc(doc(db, 'staff', user.uid));
        if (staffDoc.exists()) {
          const data = staffDoc.data();
          setProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: data.fullName || user.displayName || '',
            role: data.role,
            branchId: data.branchId,
            staffId: staffDoc.id
          });
        } else {
          // Check members
          const memberDoc = await getDoc(doc(db, 'members', user.uid));
          if (memberDoc.exists()) {
             const data = memberDoc.data();
             setProfile({
                uid: user.uid,
                email: user.email || '',
                displayName: data.fullName || user.displayName || '',
                role: 'Member',
                memberId: memberDoc.id
             });
          } else {
            setProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'User',
              role: 'Admin', // Default for first user/unmatched
            });
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setIsGuest(false);
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    setIsGuest(false);
    await signInWithPopup(auth, googleProvider);
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsGuest(false);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Create initial staff profile for the admin
      const path = `staff/${user.uid}`;
      try {
        await setDoc(doc(db, 'staff', user.uid), {
          fullName,
          email,
          role: 'Admin',
          branchId: 'Main Branch',
          hireDate: new Date().toISOString()
        });
      } catch (dbError) {
        handleFirestoreError(dbError, OperationType.WRITE, path);
      }
    } catch (authError: any) {
      // Re-throw auth errors to be handled by the UI
      throw authError;
    }
  };

  const guestLogin = () => {
    setIsGuest(true);
    // Mock user and profile
    const mockUser = {
      uid: 'guest-123',
      email: 'guest@pakgym.com',
      displayName: 'Guest Admin',
    } as User;
    
    setUser(mockUser);
    setProfile({
      uid: 'guest-123',
      email: 'guest@pakgym.com',
      displayName: 'Guest Admin',
      role: 'Admin',
    });
    setLoading(false);
  };

  const logout = async () => {
    setIsGuest(false);
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithGoogle, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
