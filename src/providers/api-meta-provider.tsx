'use client';

import React, { createContext, useContext, useState } from 'react';

export interface ApiMeta {
  timestamp: string;
  apiVersion: string;
  traceId: string;
  requestId: string;
}

interface ApiMetaContextType {
  lastMeta: ApiMeta | null;
  setLastMeta: (meta: ApiMeta | null) => void;
  metaHistory: ApiMeta[];
  addToHistory: (meta: ApiMeta) => void;
  clearHistory: () => void;
}

const ApiMetaContext = createContext<ApiMetaContextType | undefined>(undefined);

const MAX_HISTORY_SIZE = 50;

export const ApiMetaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastMeta, setLastMeta] = useState<ApiMeta | null>(null);
  const [metaHistory, setMetaHistory] = useState<ApiMeta[]>([]);

  const addToHistory = (meta: ApiMeta) => {
    setMetaHistory((prev) => {
      const newHistory = [meta, ...prev];
      return newHistory.slice(0, MAX_HISTORY_SIZE);
    });
  };

  const clearHistory = () => {
    setMetaHistory([]);
  };

  const handleSetLastMeta = (meta: ApiMeta | null) => {
    setLastMeta(meta);
    if (meta) {
      addToHistory(meta);

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[API Meta]', {
          timestamp: meta.timestamp,
          apiVersion: meta.apiVersion,
          traceId: meta.traceId,
          requestId: meta.requestId,
        });
      }
    }
  };

  return (
    <ApiMetaContext.Provider
      value={{
        lastMeta,
        setLastMeta: handleSetLastMeta,
        metaHistory,
        addToHistory,
        clearHistory,
      }}
    >
      {children}
    </ApiMetaContext.Provider>
  );
};

export const useApiMeta = () => {
  const context = useContext(ApiMetaContext);
  if (!context) {
    throw new Error('useApiMeta must be used within ApiMetaProvider');
  }
  return context;
};
