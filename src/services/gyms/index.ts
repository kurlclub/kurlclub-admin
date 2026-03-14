import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Gym, GymFormData } from '@/types/gym';
import type { GymMember, GymMembersResult } from '@/types/member';

interface ApiResponse<T> {
  data?: T;
}

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data as T;
  }
  return payload as T;
};

const normalizeGymList = (payload: unknown): Gym[] => {
  if (Array.isArray(payload)) return payload as Gym[];
  if (payload && typeof payload === 'object') {
    const maybeGyms = (payload as { gyms?: Gym[] }).gyms;
    if (Array.isArray(maybeGyms)) return maybeGyms;
    const maybeItems = (payload as { items?: Gym[] }).items;
    if (Array.isArray(maybeItems)) return maybeItems;
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
    return {
      members: payload as GymMember[],
      currentPage: 1,
      pageSize: payload.length,
      totalPages: 1,
    };
  }

  if (typeof payload !== 'object') return fallback;

  const data = (payload as Record<string, unknown>).data ?? payload;
  const members =
    (data as Record<string, unknown>).members ??
    (data as Record<string, unknown>).items ??
    (data as Record<string, unknown>).data ??
    (data as Record<string, unknown>).results ??
    [];

  const currentPage =
    (data as Record<string, unknown>).currentPage ??
    (data as Record<string, unknown>).page ??
    (data as Record<string, unknown>).pageNumber ??
    1;

  const pageSize =
    (data as Record<string, unknown>).pageSize ??
    (data as Record<string, unknown>).size ??
    (Array.isArray(members) ? members.length : fallback.pageSize);

  const totalPages =
    (data as Record<string, unknown>).totalPages ??
    (data as Record<string, unknown>).totalPage ??
    1;

  const totalCount =
    (data as Record<string, unknown>).totalCount ??
    (data as Record<string, unknown>).totalItems ??
    (data as Record<string, unknown>).count;

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
  const response = await api.get<ApiResponse<Gym[]> | Gym[]>('/Gyms');
  return normalizeGymList(unwrap(response));
};

export const fetchGymById = async (id: number) => {
  const response = await api.get<ApiResponse<Gym> | Gym>(`/Gyms/${id}`);
  const payload = unwrap(response) as Gym | { gym?: Gym };
  if (payload && typeof payload === 'object' && 'gym' in payload) {
    return (payload as { gym?: Gym }).gym as Gym;
  }
  return payload as Gym;
};

export const createGym = async (data: GymFormData) => {
  const response = await api.post<ApiResponse<Gym> | Gym>('/Gyms', data);
  return unwrap(response);
};

export const updateGym = async (id: number, data: GymFormData) => {
  const response = await api.put<ApiResponse<Gym> | Gym>(`/Gyms/${id}`, data);
  return unwrap(response);
};

export const deleteGym = async (id: number) => {
  await api.delete(`/Gyms/${id}`);
};

export const fetchGymMembers = async (
  gymId: number,
  params: GymMembersParams = {},
) => {
  const response = await api.get<ApiResponse<unknown> | unknown>(
    `/Gyms/${gymId}/members`,
    {
      params: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.feeStatus ? { feeStatus: params.feeStatus } : {}),
        ...(params.package ? { package: params.package } : {}),
        ...(params.gender ? { gender: params.gender } : {}),
        ...(params.trainer ? { trainer: params.trainer } : {}),
        ...(params.sort ? { sort: params.sort } : {}),
        ...(params.currentPage ? { currentPage: params.currentPage } : {}),
        ...(params.pageSize ? { pageSize: params.pageSize } : {}),
      },
    },
  );

  return normalizeGymMembers(unwrap(response));
};

export const useGyms = () => {
  return useQuery({
    queryKey: ['gyms'],
    queryFn: fetchGyms,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGym = (id: number) => {
  return useQuery({
    queryKey: ['gym', id],
    queryFn: () => fetchGymById(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGymMembers = (gymId: number, params: GymMembersParams) => {
  return useQuery({
    queryKey: ['gymMembers', gymId, params],
    queryFn: () => fetchGymMembers(gymId, params),
    enabled: Number.isFinite(gymId),
  });
};

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
    mutationFn: ({ id, data }: { id: number; data: GymFormData }) =>
      updateGym(id, data),
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
