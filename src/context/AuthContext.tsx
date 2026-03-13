// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// User types
interface Trainer {
  id: string;
  role: 'trainer';
  name: string;
  email: string;
  avatar: string | null;
  specialization: string;
  clients: number;
  rating: number;
  experience: string;
}

interface Client {
  id: string;
  role: 'client';
  name: string;
  email: string;
  avatar: string | null;
  trainer: string;
  goal: string;
  weight: number;
  targetWeight: number;
  startDate: string;
}

type User = Trainer | Client | null;

// Signup data type
interface SignupData {
  role: 'trainer' | 'client';
  id?: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  specialization?: string;
  clients?: number;
  rating?: number;
  experience?: string;
  trainer?: string;
  goal?: string;
  weight?: number;
  targetWeight?: number;
  startDate?: string;
}

// Context type
interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string, role: 'trainer' | 'client') => Promise<void>;
  logout: () => void;
  signup: (data: SignupData) => Promise<void>;
}

// Mock data
const MOCK_TRAINER: Trainer = {
  id: 'trainer_001',
  role: 'trainer',
  name: 'Marcus Chen',
  email: 'marcus@fitpro.com',
  avatar: null,
  specialization: 'Strength & Nutrition',
  clients: 12,
  rating: 4.9,
  experience: '8 years',
};

const MOCK_CLIENT: Client = {
  id: 'client_001',
  role: 'client',
  name: 'Ahmed Al-Hassan',
  email: 'ahmed@email.com',
  avatar: null,
  trainer: 'Marcus Chen',
  goal: 'Weight Loss',
  weight: 88,
  targetWeight: 78,
  startDate: '2024-01-15',
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, role: 'trainer' | 'client') => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000)); // Simulate API
    setUser(role === 'trainer' ? MOCK_TRAINER : MOCK_CLIENT);
    setLoading(false);
  };

  const logout = () => setUser(null);

  const signup = async (data: SignupData) => {
    setLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1200)); // Simulate API

    if (data.role === 'trainer') setUser({ ...MOCK_TRAINER, ...data, role: 'trainer' });
    else setUser({ ...MOCK_CLIENT, ...data, role: 'client' });

    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthContextProvider');
  return context;
};