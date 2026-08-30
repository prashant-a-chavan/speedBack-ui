import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthSession } from '../types';
import { loginMember } from '../services/authService';
import {
  clearAuthSession,
  loadAuthSession,
  registerUnauthorizedHandler,
  saveAuthSession,
} from '../auth/authSession';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: (redirectPath?: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => loadAuthSession());
  const [isLoading] = useState(false);

  const logout = useCallback(
    (redirectPath = '/login') => {
      clearAuthSession();
      setSession(null);
      navigate(redirectPath, { replace: true });
    },
    [navigate]
  );

  const login = useCallback(
    async (username: string, password: string) => {
      const authSession = await loginMember({ username, password });
      saveAuthSession(authSession);
      setSession(authSession);
      navigate('/', { replace: true });
    },
    [navigate]
  );

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout('/login');
    });

    return () => {
      registerUnauthorizedHandler(null);
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: !!session?.accessToken,
      isLoading,
      login,
      logout,
    }),
    [session, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
