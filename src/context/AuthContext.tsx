
'use client';

import type { User } from '@/lib/types';
import { addUser, verifyCredentials, findUserByEmail } from '@/lib/mockAuthData';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // For redirection if needed

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<User | null>;
  register: (name: string, email: string, password?: string) => Promise<User | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage on initial mount
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        // Optional: You might want to re-verify the user session here if you had tokens
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false); // Finished loading attempt
  }, []);

  const login = async (email: string, password?: string): Promise<User | null> => {
    setIsLoading(true);
    const user = verifyCredentials(email, password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoading(false);
      return user;
    }
    setIsLoading(false);
    return null;
  };

  const register = async (name: string, email: string, password?: string): Promise<User | null> => {
    setIsLoading(true);
    const newUser = addUser({ name, email, password });
    if (newUser) {
      const { passwordHash, ...userToStore } = newUser as any; // Exclude passwordHash
      setCurrentUser(userToStore as User);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      setIsLoading(false);
      return userToStore as User;
    }
    setIsLoading(false);
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // Optionally redirect to home or login page
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
