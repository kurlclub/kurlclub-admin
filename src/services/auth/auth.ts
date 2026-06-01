import {
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import { STALE_5M, type ApiEnvelope } from '@/lib/api-types';
import type { AppUser } from '@/types/user';

interface LoginRequest {
  email: string;
  password: string;
}

type LoginData = {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  expiresAt?: string;
  refreshTokenExpiresAt?: string;
  email?: string;
  role?: string;
  user?: {
    id: number;
    uid: string;
    userName: string;
    email: string;
    role: string;
    phoneNumber: string;
    photoURL: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
};

type AuthMeData = {
  id: number;
  email: string;
  role: string;
  name?: string | null;
  userName?: string | null;
  phoneNumber?: string | null;
  photoPath?: string | null;
  photoURL?: string | null;
  createdAt?: string;
};

type AuthMeResult = { user: AppUser; meta?: ApiEnvelope<AuthMeData>['meta'] };
type AuthMeOptions = Omit<UseQueryOptions<AuthMeResult, Error>, 'queryKey' | 'queryFn'>;

const buildAuthUser = (payload: AuthMeData): AppUser => {
  const email = payload.email || '';
  const derivedUserName = email.includes('@') ? email.split('@')[0] : '';
  const resolvedName =
    payload.name?.trim() || payload.userName?.trim() || derivedUserName || 'Admin User';

  return {
    userId: payload.id,
    userName: resolvedName,
    userEmail: email,
    userRole: payload.role || '',
    phoneNumber: payload.phoneNumber ?? '',
    photoPath: payload.photoPath ?? payload.photoURL ?? null,
    createdAt: payload.createdAt,
  };
};

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post<ApiEnvelope<LoginData> | LoginData>(
      '/Auth/login',
      credentials,
      { skipAuth: true },
    );
    const data = (response as ApiEnvelope<LoginData>).data ?? (response as LoginData);
    const meta = (response as ApiEnvelope<LoginData>).meta;
    return { success: true, data, meta };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

export const fetchAuthMe = async (): Promise<AuthMeResult> => {
  const response = await api.get<ApiEnvelope<AuthMeData> | AuthMeData>('/Auth/me');
  const payload = (response as ApiEnvelope<AuthMeData>).data ?? (response as AuthMeData);
  const meta = (response as ApiEnvelope<AuthMeData>).meta;
  if (!payload) throw new Error('Failed to get user');
  return { user: buildAuthUser(payload), meta };
};

export const getAuthMe = async () => {
  try {
    const result = await fetchAuthMe();
    return { success: true, data: result.user, meta: result.meta };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user',
    };
  }
};

export const useAuthMe = (options?: AuthMeOptions): UseQueryResult<AuthMeResult, Error> =>
  useQuery<AuthMeResult, Error>({
    queryKey: ['auth-me'],
    queryFn: fetchAuthMe,
    staleTime: STALE_5M,
    refetchOnWindowFocus: false,
    ...options,
  });

type UpdateAdminProfilePayload = {
  id: number;
  name: string;
  phoneNumber: string;
  photoFile?: File | null;
};

export const updateAdminProfile = async (payload: UpdateAdminProfilePayload) => {
  const formData = new FormData();
  formData.append('Name', payload.name ?? '');
  formData.append('Phone', payload.phoneNumber ?? '');
  if (payload.photoFile) formData.append('Photo', payload.photoFile);
  await api.put(`/Auth/admins/${payload.id}`, formData);
  return true;
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auth-me'] }),
  });
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('appUser');
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'refreshToken=; path=/; max-age=0';
    } catch (error) {
      console.error('Logout storage clear failed:', error);
    }
  }
  return { success: true };
};

export const forgotPassword = async (email: string) =>
  api.post('/Auth/forgot-password', { email }, { skipAuth: true });

export const verifyResetOtp = async (email: string, otp: string) =>
  api.post('/Auth/verify-reset-otp', { email, otp }, { skipAuth: true });

export const resetPassword = async (email: string, otp: string, newPassword: string) =>
  api.post('/Auth/reset-password', { email, otp, newPassword }, { skipAuth: true });
