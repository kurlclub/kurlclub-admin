import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

export type AdminFormData = {
  subscriptionPlans: { id: number; name: string }[];
  adminUsers: { id: number; name: string }[];
};

type ApiEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: {
    timestamp: string;
    apiVersion: string;
    traceId: string;
    requestId: string;
  };
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const fetchAdminFormData = async (): Promise<AdminFormData> => {
  const response = await api.get<ApiEnvelope<AdminFormData> | AdminFormData>(
    '/Auth/admin-form-data',
  );
  const data = unwrap(response);
  if (!data) {
    throw new Error('Failed to load admin form data');
  }
  return data;
};

export const useAdminFormData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-form-data'],
    queryFn: fetchAdminFormData,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,
  });

  return {
    adminFormData: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
  };
};
