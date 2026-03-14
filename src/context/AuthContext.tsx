import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { firebaseAuth, db, nowTimestamp } from '../services/firebase';

interface Trainer {
  id: string;
  role: 'trainer';
  name: string;
  email: string;
  avatar: string | null;
}

interface Client {
  id: string;
  role: 'client';
  name: string;
  email: string;
  avatar: string | null;
  trainerId?: string;
}

type User = Trainer | Client | null;

interface SignupData {
  role: 'trainer' | 'client';
  name?: string;
  email?: string;
  password?: string;
  trainerId?: string;
}

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string, role: 'trainer' | 'client') => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profileDoc = await db.collection('users').doc(firebaseUser.uid).get();
      if (!profileDoc.exists) {
        setUser({
          id: firebaseUser.uid,
          role: 'client',
          name: firebaseUser.displayName || 'New User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL,
        });
        setLoading(false);
        return;
      }

      const profile = profileDoc.data() || {};
      setUser({
        id: firebaseUser.uid,
        role: profile.role === 'trainer' ? 'trainer' : 'client',
        name: profile.name || firebaseUser.displayName || 'User',
        email: profile.email || firebaseUser.email || '',
        avatar: profile.avatar || firebaseUser.photoURL || null,
        trainerId: profile.trainerId,
      } as User);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, role: 'trainer' | 'client') => {
    setLoading(true);
    const { user: authUser } = await firebaseAuth.signInWithEmailAndPassword(email.trim(), password);
    const profile = (await db.collection('users').doc(authUser.uid).get()).data();
    
    if (profile?.role && profile.role !== role) {
      await firebaseAuth.signOut();
      setLoading(false);
      throw new Error(`This account is registered as ${profile.role}, not ${role}.`);
    }
    setLoading(false);
  };

  const signup = async (data: SignupData) => {
    setLoading(true);
    const { email = '', password = '', name = '' } = data;
    const credentials = await firebaseAuth.createUserWithEmailAndPassword(email.trim(), password);

    await credentials.user.updateProfile({ displayName: name });

    await db.collection('users').doc(credentials.user.uid).set({
      role: data.role,
      name,
      email: email.trim(),
      avatar: null,
      trainerId: data.trainerId || null,
      createdAt: nowTimestamp(),
      updatedAt: nowTimestamp(),
    });

    setLoading(false);
  };

  const logout = async () => {
    await firebaseAuth.signOut();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, signup }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthContextProvider');
  return context;
};