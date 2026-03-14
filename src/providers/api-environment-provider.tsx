'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { abortInFlightRequests } from '@/lib/api';
import {
  API_ENV_STORAGE_KEY,
  type ApiEnvironment,
  getStoredApiEnvironment,
  normalizeApiEnvironment,
  setStoredApiEnvironment,
} from '@/lib/api-environment';

interface ApiEnvironmentContextValue {
  environment: ApiEnvironment;
  setEnvironment: (next: ApiEnvironment) => void;
}

const ApiEnvironmentContext = createContext<ApiEnvironmentContextValue | null>(
  null,
);

export function ApiEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [environment, setEnvironmentState] = useState<ApiEnvironment>(() =>
    getStoredApiEnvironment(),
  );

  useEffect(() => {
    setStoredApiEnvironment(environment);
  }, [environment]);

  const setEnvironment = useCallback(
    (next: ApiEnvironment) => {
      setEnvironmentState(next);
      setStoredApiEnvironment(next);
      abortInFlightRequests();
      queryClient.invalidateQueries({ refetchType: 'active' });
    },
    [queryClient],
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== API_ENV_STORAGE_KEY) return;
      const next = normalizeApiEnvironment(event.newValue);
      setEnvironmentState(next);
      abortInFlightRequests();
      queryClient.invalidateQueries({ refetchType: 'active' });
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [queryClient]);

  const value = useMemo(
    () => ({ environment, setEnvironment }),
    [environment, setEnvironment],
  );

  return (
    <ApiEnvironmentContext.Provider value={value}>
      {children}
    </ApiEnvironmentContext.Provider>
  );
}

export function useApiEnvironment() {
  const context = useContext(ApiEnvironmentContext);
  if (!context) {
    throw new Error(
      'useApiEnvironment must be used within ApiEnvironmentProvider',
    );
  }
  return context;
}
