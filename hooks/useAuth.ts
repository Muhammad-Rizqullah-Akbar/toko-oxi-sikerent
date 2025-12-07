// hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';

interface UseAuthReturn {
  user: undefined | null;
  customer: undefined | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  type: 'user' | 'customer' | null; // Gunakan type, bukan role
}

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<UseAuthReturn>({
    user: null,
    customer: null,
    isLoading: true,
    isAuthenticated: false,
    type: null,
  });

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          
          if (data.authenticated) {
            if (data.type === 'user') {
              setAuthState({
                user: data.user,
                customer: null,
                isLoading: false,
                isAuthenticated: true,
                type: 'user',
              });
            } else if (data.type === 'customer') {
              setAuthState({
                user: null,
                customer: data.customer,
                isLoading: false,
                isAuthenticated: true,
                type: 'customer',
              });
            }
          } else {
            setAuthState({
              user: null,
              customer: null,
              isLoading: false,
              isAuthenticated: false,
              type: null,
            });
          }
        }
      } catch (error) {
        console.error('Auth fetch error:', error);
        setAuthState({
          user: null,
          customer: null,
          isLoading: false,
          isAuthenticated: false,
          type: null,
        });
      }
    };

    fetchAuth();
  }, []);

  return authState;
}