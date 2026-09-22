'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isInitialized: boolean;
}

const AUTH_STORAGE_KEY = 'ec_admin_session_v1';

const DEFAULT_ADMIN: AdminUser = {
  username: 'admin',
  name: 'Muhammad Rafiqul Alam',
  role: 'super_admin',
  designation: 'Senior Election Officer (EC Super Admin)',
  lastLogin: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const user = JSON.parse(saved);
        if (user && user.username) {
          setAuthState({
            isAuthenticated: true,
            user,
          });
        }
      }
    } catch (e) {
      console.error('Failed to load auth state', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Simulating authentication
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      return { success: false, message: 'Please enter both username and password' };
    }

    if (
      (trimmedUser === 'admin' && trimmedPass === 'admin123') ||
      (trimmedUser === 'ec_admin' && trimmedPass === 'ec2026')
    ) {
      const loggedUser: AdminUser = {
        ...DEFAULT_ADMIN,
        username: trimmedUser,
        lastLogin: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setAuthState({
        isAuthenticated: true,
        user: loggedUser,
      });

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
      } catch (e) {
        console.error('Failed to persist auth session', e);
      }

      return { success: true };
    }

    return { success: false, message: 'Invalid username or password! Please try again.' };
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth session', e);
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isInitialized }}>
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
