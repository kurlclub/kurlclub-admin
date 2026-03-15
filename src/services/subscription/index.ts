import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';

// API Response wrapper
interface ApiResponse<T> {
  status: string;
  data: T;
}

// Fetch all subscriptions
export const fetchSubscriptions = async () => {
  const response = await api.get<ApiResponse<Subscription[]>>('/Subscription');
  return response.data;
};

// Fetch single subscription by ID
export const fetchSubscriptionById = async (id: number) => {
  const response = await api.get<ApiResponse<Subscription>>(
    `/Subscription/${id}`,
  );
  return response.data;
};

const buildSubscriptionFormData = (data: SubscriptionFormData) => {
  const formData = new FormData();
  const isFile = (value: unknown): value is File =>
    typeof File !== 'undefined' && value instanceof File;
  const appendValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return;

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

  Object.entries(data).forEach(([key, value]) => appendValue(key, value));

  return formData;
};

// Create subscription
export const createSubscription = async (data: SubscriptionFormData) => {
  const formData = buildSubscriptionFormData(data);
  const response = await api.post<ApiResponse<Subscription>>(
    '/Subscription',
    formData,
  );
  return response.data;
};

// Update subscription
export const updateSubscription = async (
  id: number,
  data: SubscriptionFormData,
) => {
  const formData = buildSubscriptionFormData(data);
  const response = await api.put<ApiResponse<Subscription>>(
    `/Subscription/${id}`,
    formData,
  );
  return response.data;
};

// Delete subscription
export const deleteSubscription = async (id: number) => {
  await api.delete(`/Subscription/${id}`);
};

// React Query Hooks
const QUERY_KEY = 'subscriptions';

export const useSubscriptions = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: fetchSubscriptions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubscription = (id: number) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubscriptionFormData }) =>
      updateSubscription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
};
