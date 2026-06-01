import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { STALE_5M, unwrap, type ApiEnvelope } from '@/lib/api-types';
import type { Gym, GymFormData } from '@/types/gym';
import type { GymMember, GymMembersResult } from '@/types/member';

const normalizeGymList = (payload: unknown): Gym[] => {
  if (Array.isArray(payload)) return payload as Gym[];
  if (payload && typeof payload === 'object') {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.gyms)) return asRecord.gyms as Gym[];
    if (Array.isArray(asRecord.items)) return asRecord.items as Gym[];
  }
  return [];
};

const normalizeGymMembers = (payload: unknown): GymMembersResult => {
  const fallback: GymMembersResult = {
    members: [],
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  };

  if (!payload) return fallback;
  if (Array.isArray(payload)) {
    return { members: payload as GymMember[], currentPage: 1, pageSize: payload.length, totalPages: 1 };
  }
  if (typeof payload !== 'object') return fallback;

  const data = (payload as Record<string, unknown>).data ?? payload;
  const d = data as Record<string, unknown>;
  const members = d.members ?? d.items ?? d.data ?? d.results ?? [];
  const currentPage = d.currentPage ?? d.page ?? d.pageNumber ?? 1;
  const pageSize = d.pageSize ?? d.size ?? (Array.isArray(members) ? members.length : fallback.pageSize);
  const totalPages = d.totalPages ?? d.totalPage ?? 1;
  const totalCount = d.totalCount ?? d.totalItems ?? d.count;

  return {
    members: Array.isArray(members) ? (members as GymMember[]) : [],
    currentPage: Number(currentPage) || 1,
    pageSize: Number(pageSize) || fallback.pageSize,
    totalPages: Number(totalPages) || 1,
    totalCount: typeof totalCount === 'number' ? totalCount : undefined,
  };
};

export interface GymMembersParams {
  search?: string;
  feeStatus?: string;
  package?: string;
  gender?: string;
  trainer?: string;
  sort?: string;
  currentPage?: number;
  pageSize?: number;
}

export const fetchGyms = async () => {
  const response = await api.get<ApiEnvelope<Gym[]> | Gym[]>('/Gyms');
  return normalizeGymList(unwrap(response));
};

export const fetchGymById = async (id: number) => {
  const response = await api.get<ApiEnvelope<Gym> | Gym>(`/Gyms/${id}`);
  const payload = unwrap(response) as Gym | { gym?: Gym };
  if (payload && typeof payload === 'object' && 'gym' in payload) {
    return (payload as { gym?: Gym }).gym as Gym;
  }
  return payload as Gym;
};

export const createGym = async (data: GymFormData) => {
  const response = await api.post<ApiEnvelope<Gym> | Gym>('/Gyms', data);
  return unwrap(response);
};

export const updateGym = async (id: number, data: GymFormData) => {
  const response = await api.put<ApiEnvelope<Gym> | Gym>(`/Gyms/${id}`, data);
  return unwrap(response);
};

export const deleteGym = async (id: number) => {
  await api.delete(`/Gyms/${id}`);
};

export const fetchGymMembers = async (gymId: number, params: GymMembersParams = {}) => {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  ) as Record<string, string | number | boolean>;

  const response = await api.get<ApiEnvelope<unknown> | unknown>(
    `/Gyms/${gymId}/members`,
    { params: queryParams },
  );
  return normalizeGymMembers(unwrap(response));
};

export const useGyms = () =>
  useQuery({ queryKey: ['gyms'], queryFn: fetchGyms, staleTime: STALE_5M });

export const useGym = (id: number) =>
  useQuery({
    queryKey: ['gym', id],
    queryFn: () => fetchGymById(id),
    enabled: Number.isFinite(id),
    staleTime: STALE_5M,
  });

export const useGymMembers = (gymId: number, params: GymMembersParams) =>
  useQuery({
    queryKey: ['gymMembers', gymId, params],
    queryFn: () => fetchGymMembers(gymId, params),
    enabled: Number.isFinite(gymId),
  });

export const useCreateGym = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
};

export const useUpdateGym = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: GymFormData }) => updateGym(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      queryClient.invalidateQueries({ queryKey: ['gym', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
  });
};

export const useDeleteGym = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGym,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gyms'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client'] });
    },
  });
};
