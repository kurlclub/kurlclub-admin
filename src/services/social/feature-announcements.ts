import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { type ApiEnvelope, STALE_5M, unwrap } from '@/lib/api-types';
import type {
  FeatureAnnouncement,
  FeatureAnnouncementFormData,
  FeatureAnnouncementListParams,
  FeatureAnnouncementListResult,
  FeatureAnnouncementUpdateData,
  FeatureItem,
} from '@/types/feature-announcement';

const BASE_PATH = '/Version';

// ─── Backend ↔ FE mapping ────────────────────────────────────────────────────
// The backend uses `latestVersion` and per-feature `image`; the FE uses
// `version` and `src`. Map at the service boundary so the UI keeps its own names.

type ApiFeatureItem = {
  image?: string;
  src?: string;
  tag?: string;
  title?: string;
  description?: string;
};

const featureFromApi = (item: ApiFeatureItem): FeatureItem => ({
  src: item.image ?? item.src ?? '',
  tag: item.tag ?? '',
  title: item.title ?? '',
  description: item.description ?? '',
});

const fromApi = (raw: unknown): FeatureAnnouncement => {
  const r = (raw ?? {}) as Record<string, unknown>;
  const rawFeatures = Array.isArray(r.features)
    ? (r.features as ApiFeatureItem[])
    : [];
  return {
    id: (r.id as number) ?? 0,
    version: (r.latestVersion as string) ?? (r.version as string) ?? '',
    minimumVersion: (r.minimumVersion as string) ?? '',
    features: rawFeatures.map(featureFromApi),
    status: (r.status as FeatureAnnouncement['status']) ?? 'draft',
    createdAt: (r.createdAt as string) ?? '',
    updatedAt: (r.updatedAt as string) ?? '',
  };
};

const toApiPayload = (
  data: FeatureAnnouncementFormData | FeatureAnnouncementUpdateData,
): Record<string, unknown> => {
  const payload: Record<string, unknown> = {};
  if (data.version !== undefined) payload.latestVersion = data.version;
  if (data.minimumVersion !== undefined)
    payload.minimumVersion = data.minimumVersion;
  if (data.status !== undefined) payload.status = data.status;
  if (data.features !== undefined)
    payload.features = data.features.map((f) => ({
      image: f.src,
      tag: f.tag,
      title: f.title,
      description: f.description,
    }));
  return payload;
};

const normalizeFeatureList = (
  payload: unknown,
): FeatureAnnouncementListResult => {
  const fallback: FeatureAnnouncementListResult = {
    features: [],
    meta: { page: 1, pageSize: 10, total: 0, pageCount: 0 },
  };
  if (!payload) return fallback;
  if (Array.isArray(payload))
    return { features: payload.map(fromApi), meta: fallback.meta };
  if (typeof payload !== 'object') return fallback;
  const p = payload as Record<string, unknown>;
  const data = Array.isArray(p.data) ? p.data : [];
  const meta = {
    ...fallback.meta,
    ...((p.meta as Partial<FeatureAnnouncementListResult['meta']>) ?? {}),
  };
  return { features: data.map(fromApi), meta };
};

export const fetchFeatureAnnouncements = async (
  params: FeatureAnnouncementListParams = {},
): Promise<FeatureAnnouncementListResult> => {
  const queryParams = Object.fromEntries(
    Object.entries({ status: 'all', limit: 100, ...params }).filter(
      ([, v]) => v !== undefined,
    ),
  ) as Record<string, string | number | boolean>;
  const response = await api.get<unknown>(BASE_PATH, {
    params: queryParams,
  });
  return normalizeFeatureList(unwrap(response));
};

export const fetchFeatureAnnouncement = async (
  id: number,
): Promise<FeatureAnnouncement> => {
  const response = await api.get<ApiEnvelope<unknown> | unknown>(
    `${BASE_PATH}/${id}`,
  );
  return fromApi(unwrap(response));
};

export const createFeatureAnnouncement = async (
  data: FeatureAnnouncementFormData,
): Promise<FeatureAnnouncement> => {
  const response = await api.post<ApiEnvelope<unknown> | unknown>(
    BASE_PATH,
    toApiPayload(data),
  );
  return fromApi(unwrap(response));
};

export const updateFeatureAnnouncement = async (
  id: number,
  data: FeatureAnnouncementUpdateData,
): Promise<FeatureAnnouncement> => {
  const response = await api.put<ApiEnvelope<unknown> | unknown>(
    `${BASE_PATH}/${id}`,
    toApiPayload(data),
  );
  return fromApi(unwrap(response));
};

export const deleteFeatureAnnouncement = async (id: number): Promise<void> => {
  await api.delete(`${BASE_PATH}/${id}`);
};

// ─── Image upload ────────────────────────────────────────────────────────────

type UploadResponseObject = {
  src?: string;
  url?: string;
  path?: string;
  fileUrl?: string;
  fileName?: string;
  imageUrl?: string;
  location?: string;
  Location?: string;
};

const extractUploadedSrc = (payload: unknown): string | undefined => {
  // Some endpoints return the URL as a bare string rather than an object.
  if (typeof payload === 'string') return payload.trim() || undefined;
  if (!payload || typeof payload !== 'object') return undefined;
  const p = payload as UploadResponseObject;
  return (
    p.src ??
    p.url ??
    p.path ??
    p.fileUrl ??
    p.imageUrl ??
    p.location ??
    p.Location ??
    p.fileName
  );
};

export const uploadFeatureImage = async (
  file: File,
): Promise<{ src: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<ApiEnvelope<unknown> | unknown>(
    `${BASE_PATH}/uploads`,
    formData,
  );
  const src = extractUploadedSrc(unwrap(response));
  if (!src) {
    throw new Error('Upload response did not include an image URL.');
  }
  return { src };
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

export const useUploadFeatureImage = () =>
  useMutation({ mutationFn: uploadFeatureImage });
