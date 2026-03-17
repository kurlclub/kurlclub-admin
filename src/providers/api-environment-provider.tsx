'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { abortInFlightRequests } from '@/lib/api';
import {
  API_ENV_STORAGE_KEY,
  type ApiEnvironment,
  DEFAULT_API_ENV,
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

type StoredEnvironmentState = {
  environment: ApiEnvironment;
  hydrated: boolean;
};

const envStore = (() => {
  const listeners = new Set<() => void>();
  const serverSnapshot: StoredEnvironmentState = {
    environment: DEFAULT_API_ENV,
    hydrated: false,
  };
  let cachedSnapshot: StoredEnvironmentState = serverSnapshot;

  const getSnapshot = (): StoredEnvironmentState => {
    const nextEnvironment = getStoredApiEnvironment();
    if (
      cachedSnapshot.hydrated &&
      cachedSnapshot.environment === nextEnvironment
    ) {
      return cachedSnapshot;
    }
    cachedSnapshot = {
      environment: nextEnvironment,
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

export function ApiEnvironmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { environment } = useSyncExternalStore(
    envStore.subscribe,
    envStore.getSnapshot,
    envStore.getServerSnapshot,
  );

  const setEnvironment = useCallback(
    (next: ApiEnvironment) => {
      setStoredApiEnvironment(next);
      envStore.notify();
      abortInFlightRequests();
      queryClient.invalidateQueries({ refetchType: 'active' });
    },
    [queryClient],
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== API_ENV_STORAGE_KEY) return;
      const next = normalizeApiEnvironment(event.newValue);
      setStoredApiEnvironment(next);
      envStore.notify();
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
