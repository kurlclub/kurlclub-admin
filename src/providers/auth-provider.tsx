'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { decrypt, encrypt } from '@/lib/crypto';
import { getAuthMe, login, logout as logoutApi } from '@/services/auth/auth';
import { AppUser } from '@/types/user';

import { useApiMeta } from './api-meta-provider';

interface AuthContextType {
  user: AppUser | null;
  isReady: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const getMaxAgeSeconds = (isoString: string | undefined, fallback: number) => {
  if (!isoString) return fallback;
  const parsed = new Date(isoString);
  const ms = parsed.getTime() - Date.now();
  if (Number.isNaN(parsed.getTime()) || ms <= 0) {
    return fallback;
  }
  return Math.max(1, Math.floor(ms / 1000));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const { setLastMeta } = useApiMeta();

  useEffect(() => {
    const loadCachedUser = () => {
      try {
        const token = localStorage.getItem('accessToken');
        const encryptedUser = localStorage.getItem('appUser');

        if (token && encryptedUser) {
          const decryptedData = decrypt(encryptedUser);
          if (decryptedData) {
            const userData = JSON.parse(decryptedData) as AppUser;
            setUser(userData);
          }
        } else if (encryptedUser) {
          localStorage.removeItem('appUser');
        }
      } catch (error) {
        console.warn('Failed to load cached user:', error);
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('appUser');
        } catch (e) {
          console.error('Failed to clear storage:', e);
        }
      }
    };

    loadCachedUser();
    const readyId = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(readyId);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password });

      // Store API meta if available
      if (result.meta) {
        setLastMeta(result.meta);
      }

      if (!result.success || !result.data) {
        return { success: false, error: result.error || 'Login failed' };
      }

      const { accessToken, refreshToken } = result.data;

      if (!accessToken || !refreshToken) {
        return { success: false, error: 'Invalid login response' };
      }

      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const accessTokenMaxAge = getMaxAgeSeconds(
          (result.data as { expiresAt?: string }).expiresAt,
          ACCESS_TOKEN_COOKIE_MAX_AGE,
        );
        const refreshTokenMaxAge = getMaxAgeSeconds(
          (result.data as { refreshTokenExpiresAt?: string })
            .refreshTokenExpiresAt,
          REFRESH_TOKEN_COOKIE_MAX_AGE,
        );

        document.cookie = `accessToken=${accessToken}; path=/; max-age=${accessTokenMaxAge}; SameSite=Strict`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${refreshTokenMaxAge}; SameSite=Strict`;
      } catch (storageError) {
        console.error('Failed to store tokens:', storageError);
        return { success: false, error: 'Failed to save session' };
      }

      const userResult = await getAuthMe();

      // Store API meta if available
      if (userResult.meta) {
        setLastMeta(userResult.meta);
      }

      if (!userResult.success || !userResult.data) {
        return { success: false, error: 'Failed to fetch user details' };
      }

      const fullUser: AppUser = {
        ...userResult.data,
      };

      setUser(fullUser);

      try {
        localStorage.setItem('appUser', encrypt(JSON.stringify(fullUser)));
      } catch (storageError) {
        console.error('Failed to store user data:', storageError);
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const handleLogout = () => {
    logoutApi();

    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isReady,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
