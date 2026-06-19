import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { type ApiEnvelope, STALE_5M, unwrap } from '@/lib/api-types';
import type {
  FeatureAnnouncement,
  FeatureAnnouncementFormData,
  FeatureAnnouncementListParams,
  FeatureAnnouncementListResult,
  FeatureAnnouncementUpdateData,
} from '@/types/feature-announcement';

const normalizeFeatureList = (
  payload: unknown,
): FeatureAnnouncementListResult => {
  const fallback: FeatureAnnouncementListResult = {
    features: [],
    meta: { page: 1, pageSize: 10, total: 0, pageCount: 0 },
  };
  if (!payload) return fallback;
  if (Array.isArray(payload))
    return { features: payload as FeatureAnnouncement[], meta: fallback.meta };
  if (typeof payload !== 'object') return fallback;
  const p = payload as Record<string, unknown>;
  const data = Array.isArray(p.data) ? p.data : [];
  const meta = {
    ...fallback.meta,
    ...((p.meta as Partial<FeatureAnnouncementListResult['meta']>) ?? {}),
  };
  return { features: data as FeatureAnnouncement[], meta };
};

export const fetchFeatureAnnouncements = async (
  params: FeatureAnnouncementListParams = {},
): Promise<FeatureAnnouncementListResult> => {
  const queryParams = Object.fromEntries(
    Object.entries({ status: 'all', limit: 100, ...params }).filter(
      ([, v]) => v !== undefined,
    ),
  ) as Record<string, string | number | boolean>;
  const response = await api.get<unknown>('/feature-announcements', {
    params: queryParams,
  });
  return normalizeFeatureList(unwrap(response));
};

export const fetchFeatureAnnouncement = async (
  id: number,
): Promise<FeatureAnnouncement> => {
  const response = await api.get<
    ApiEnvelope<FeatureAnnouncement> | FeatureAnnouncement
  >(`/feature-announcements/${id}`);
  return unwrap(response) as FeatureAnnouncement;
};

export const createFeatureAnnouncement = async (
  data: FeatureAnnouncementFormData,
): Promise<FeatureAnnouncement> => {
  const response = await api.post<
    ApiEnvelope<FeatureAnnouncement> | FeatureAnnouncement
  >('/feature-announcements', data);
  return unwrap(response) as FeatureAnnouncement;
};

export const updateFeatureAnnouncement = async (
  id: number,
  data: FeatureAnnouncementUpdateData,
): Promise<FeatureAnnouncement> => {
  const response = await api.patch<
    ApiEnvelope<FeatureAnnouncement> | FeatureAnnouncement
  >(`/feature-announcements/${id}`, data as Record<string, unknown>);
  return unwrap(response) as FeatureAnnouncement;
};

export const deleteFeatureAnnouncement = async (id: number): Promise<void> => {
  await api.delete(`/feature-announcements/${id}`);
};

// ─── React Query Hooks ──────────────────────────────────────────────────────

export const useFeatureAnnouncements = (
  params: FeatureAnnouncementListParams = {},
) =>
  useQuery({
    queryKey: ['feature-announcements', params],
    queryFn: () => fetchFeatureAnnouncements(params),
    staleTime: STALE_5M,
  });

export const useFeatureAnnouncement = (id: number) =>
  useQuery({
    queryKey: ['feature-announcement', id],
    queryFn: () => fetchFeatureAnnouncement(id),
    enabled: !!id,
    staleTime: STALE_5M,
  });

export const useCreateFeatureAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFeatureAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-announcements'] });
    },
  });
};

export const useUpdateFeatureAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FeatureAnnouncementUpdateData;
    }) => updateFeatureAnnouncement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['feature-announcement'] });
    },
  });
};

export const useDeleteFeatureAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFeatureAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-announcements'] });
    },
  });
};
