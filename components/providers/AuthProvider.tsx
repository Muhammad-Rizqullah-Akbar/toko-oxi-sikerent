// components/providers/AuthProvider.tsx (simplified)

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: undefined | null;
  customer: undefined | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    user: null,
    customer: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setAuthState({
              isAuthenticated: true,
              user: data.user || null,
              customer: data.customer || null,
              isLoading: false,
            });
          } else {
            setAuthState({
              isAuthenticated: false,
              user: null,
              customer: null,
              isLoading: false,
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          customer: null,
          isLoading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}