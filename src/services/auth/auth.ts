import {
  type UseQueryOptions,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { AppUser } from '@/types/user';

interface LoginRequest {
  email: string;
  password: string;
}

type ApiMeta = {
  timestamp: string;
  apiVersion: string;
  traceId: string;
  requestId: string;
};

type ApiEnvelope<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: ApiMeta;
};

type LegacyLoginData = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
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

type ModernLoginData = {
  accessToken: string;
  refreshToken: string;
  email?: string;
  role?: string;
  expiresAt?: string;
  refreshTokenExpiresAt?: string;
};

type LoginData = LegacyLoginData | ModernLoginData;

type LoginResponse = ApiEnvelope<LoginData>;

type AuthMeData = {
  id: number;
  email: string;
  role: string;
  name?: string | null;
  userName?: string | null;
  phoneNumber?: string | null;
  photoPath?: string | null;
  createdAt?: string;
};

type AuthMeResponse = ApiEnvelope<AuthMeData>;

const buildAuthUser = (payload: AuthMeData): AppUser => {
  const email = payload.email || '';
  const derivedUserName =
    email && email.includes('@') ? email.split('@')[0] : '';
  const resolvedName =
    payload.name?.trim() ||
    payload.userName?.trim() ||
    derivedUserName ||
    'Admin User';

  return {
    userId: payload.id,
    userName: resolvedName,
    userEmail: email,
    userRole: payload.role || '',
    phoneNumber: payload.phoneNumber ?? '',
    photoPath:
      payload.photoPath ??
      (payload as { photoURL?: string | null }).photoURL ??
      null,
    createdAt: payload.createdAt,
  };
};

export const login = async (credentials: LoginRequest) => {
  try {
    const response = await api.post<LoginResponse | LoginData>(
      '/Auth/login',
      credentials,
      { skipAuth: true },
    );
    const data =
      (response as LoginResponse).data ?? (response as LoginData | undefined);
    const meta = (response as LoginResponse).meta;
    return { success: true, data, meta };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
};

export const getAuthMe = async () => {
  try {
    const response = await api.get<AuthMeResponse | AuthMeData>('/Auth/me');
    const payload =
      (response as AuthMeResponse).data ?? (response as AuthMeData | undefined);
    const meta = (response as AuthMeResponse).meta;

    if (!payload) {
      return { success: false, error: 'Failed to get user' };
    }

    const user = buildAuthUser(payload);

    return {
      success: true,
      data: user,
      meta,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user',
    };
  }
};

type AuthMeResult = { user: AppUser; meta?: ApiMeta };

export const fetchAuthMe = async (): Promise<AuthMeResult> => {
  const response = await api.get<AuthMeResponse | AuthMeData>('/Auth/me');
  const payload =
    (response as AuthMeResponse).data ?? (response as AuthMeData | undefined);
  const meta = (response as AuthMeResponse).meta;

  if (!payload) {
    throw new Error('Failed to get user');
  }

  return {
    user: buildAuthUser(payload),
    meta,
  };
};

type AuthMeOptions = Omit<
  UseQueryOptions<AuthMeResult, Error>,
  'queryKey' | 'queryFn'
>;

export const useAuthMe = (
  options?: AuthMeOptions,
): UseQueryResult<AuthMeResult, Error> => {
  return useQuery<AuthMeResult, Error>({
    queryKey: ['auth-me'],
    queryFn: fetchAuthMe,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

type UpdateAdminProfilePayload = {
  id: number;
  name: string;
  phoneNumber: string;
  photoFile?: File | null;
};

const buildAdminProfileFormData = (payload: UpdateAdminProfilePayload) => {
  const formData = new FormData();
  formData.append('Name', payload.name ?? '');
  formData.append('Phone', payload.phoneNumber ?? '');
  if (payload.photoFile) {
    formData.append('Photo', payload.photoFile);
  }
  return formData;
};

export const updateAdminProfile = async (
  payload: UpdateAdminProfilePayload,
) => {
  const formData = buildAdminProfileFormData(payload);
  await api.put(`/Auth/admins/${payload.id}`, formData);
  return true;
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
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

export const forgotPassword = async (email: string) => {
  const response = await api.post(
    '/Auth/forgot-password',
    { email },
    { skipAuth: true },
  );
  return response;
};

export const verifyResetOtp = async (email: string, otp: string) => {
  const response = await api.post(
    '/Auth/verify-reset-otp',
    { email, otp },
    { skipAuth: true },
  );
  return response;
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const response = await api.post(
    '/Auth/reset-password',
    { email, otp, newPassword },
    { skipAuth: true },
  );
  return response;
};
