'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

import { useRouter } from 'next/navigation';

import { useQueryClient } from '@tanstack/react-query';

import { decrypt, encrypt } from '@/lib/crypto';
import {
  getAuthMe,
  login,
  logout as logoutApi,
  useAuthMe,
} from '@/services/auth/auth';
import { AppUser } from '@/types/user';

import { useApiMeta } from './api-meta-provider';

interface AuthContextType {
  user: AppUser | null;
  isReady: boolean;
  refreshUser: () => Promise<{ success: boolean; error?: string }>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const REFRESH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type StoredAuthState = {
  user: AppUser | null;
  hasToken: boolean;
  hydrated: boolean;
};

const authStore = (() => {
  const listeners = new Set<() => void>();
  const serverSnapshot: StoredAuthState = {
    user: null,
    hasToken: false,
    hydrated: false,
  };
  let cachedSnapshot: StoredAuthState = serverSnapshot;
  let lastToken: string | null = null;
  let lastEncryptedUser: string | null = null;

  const getSnapshot = (): StoredAuthState => {
    if (typeof window === 'undefined') {
      return serverSnapshot;
    }

    let token: string | null = null;
    let encryptedUser: string | null = null;

    try {
      token = localStorage.getItem('accessToken');
      encryptedUser = localStorage.getItem('appUser');
    } catch (error) {
      console.warn('Failed to read auth storage:', error);
    }

    if (
      cachedSnapshot.hydrated &&
      token === lastToken &&
      encryptedUser === lastEncryptedUser
    ) {
      return cachedSnapshot;
    }

    lastToken = token;
    lastEncryptedUser = encryptedUser;

    const hasToken = Boolean(token);
    let nextUser: AppUser | null = null;

    if (hasToken && encryptedUser) {
      const decryptedData = decrypt(encryptedUser);
      if (decryptedData) {
        try {
          nextUser = JSON.parse(decryptedData) as AppUser;
        } catch (error) {
          console.warn('Failed to parse cached user:', error);
        }
      }
    }

    cachedSnapshot = {
      user: nextUser,
      hasToken,
      hydrated: true,
    };
    return cachedSnapshot;
  };

  return {
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify: () => {
      listeners.forEach((listener) => listener());
    },
    getSnapshot,
    getServerSnapshot: () => serverSnapshot,
  };
})();

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
  const storedAuth = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );
  const { user: cachedUser, hasToken, hydrated } = storedAuth;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setLastMeta } = useApiMeta();

  const persistUser = useCallback((nextUser: AppUser | null) => {
    try {
      if (nextUser) {
        localStorage.setItem('appUser', encrypt(JSON.stringify(nextUser)));
      } else {
        localStorage.removeItem('appUser');
      }
    } catch (storageError) {
      console.error('Failed to store user data:', storageError);
    }
    authStore.notify();
  }, []);

  const authMeQuery = useAuthMe({
    enabled: hasToken,
  });

  useEffect(() => {
    if (!authMeQuery.data?.user) return;
    if (authMeQuery.data.meta) {
      setLastMeta(authMeQuery.data.meta);
    }
    persistUser(authMeQuery.data.user);
  }, [authMeQuery.data, persistUser, setLastMeta]);

  const isReady = hydrated && (!hasToken || !authMeQuery.isLoading);
  const resolvedUser = authMeQuery.data?.user ?? cachedUser;

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
        authStore.notify();

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

      persistUser(fullUser);
      queryClient.setQueryData(['auth-me'], {
        user: fullUser,
        meta: userResult.meta,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const refreshUser = useCallback(async () => {
    const result = await authMeQuery.refetch();
    if (result.data?.meta) {
      setLastMeta(result.data.meta);
    }
    if (result.data?.user) {
      persistUser(result.data.user);
      return { success: true };
    }
    return {
      success: false,
      error: result.error?.message || 'Failed to fetch user details',
    };
  }, [authMeQuery, persistUser, setLastMeta]);

  const handleLogout = () => {
    logoutApi();

    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'refreshToken=; path=/; max-age=0';

    persistUser(null);
    queryClient.removeQueries({ queryKey: ['auth-me'] });
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        isReady,
        refreshUser,
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
