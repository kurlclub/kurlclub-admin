import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';

interface ApiEnvelope<T> {
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
}

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }
  return payload as T;
};

const buildSubscriptionFormData = (data: SubscriptionFormData) => {
  const formData = new FormData();
  const payload = {
    ...data,
    PhotoPath: typeof data.Photo === 'string' ? data.Photo : '',
  };

  const isFile = (value: unknown): value is File =>
    typeof File !== 'undefined' && value instanceof File;

  const appendValue = (key: string, value: unknown) => {
    if (value === null || value === undefined) return;

    if (key === 'Photo') {
      if (isFile(value)) {
        formData.append('photo', value);
      }
      return;
    }

    if (isFile(value)) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => appendValue(key, item));
      return;
    }

    if (typeof value === 'object') {
      Object.entries(value).forEach(([childKey, childValue]) => {
        appendValue(`${key}.${childKey}`, childValue);
      });
      return;
    }

    formData.append(key, String(value));
  };

  Object.entries(payload).forEach(([key, value]) => appendValue(key, value));

  return formData;
};

export const fetchSubscriptions = async () => {
  const response = await api.get<ApiEnvelope<Subscription[]> | Subscription[]>(
    '/Subscription',
  );
  const data = unwrap(response);
  if (!data) {
    throw new Error('Failed to load subscriptions');
  }
  return data;
};

export const fetchSubscriptionById = async (id: number) => {
  const response = await api.get<ApiEnvelope<Subscription> | Subscription>(
    `/Subscription/${id}`,
  );
  const data = unwrap(response);
  if (!data) {
    throw new Error('Failed to load subscription');
  }
  return data;
};

export const createSubscription = async (data: SubscriptionFormData) => {
  const formData = buildSubscriptionFormData(data);
  const response = await api.post<ApiEnvelope<Subscription> | Subscription>(
    '/Subscription',
    formData,
  );
  return unwrap(response);
};

export const updateSubscription = async (
  id: number,
  data: SubscriptionFormData,
) => {
  const formData = buildSubscriptionFormData(data);
  const response = await api.put<ApiEnvelope<Subscription> | Subscription>(
    `/Subscription/${id}`,
    formData,
  );
  return unwrap(response);
};

export const deleteSubscription = async (id: number) => {
  await api.delete(`/Subscription/${id}`);
};

const QUERY_KEY = ['subscriptions'] as const;

export const useSubscriptions = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchSubscriptions,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => fetchSubscriptionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubscriptionFormData }) =>
      updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
