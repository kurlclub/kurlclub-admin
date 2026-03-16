import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  GymDraft,
  LeadData,
  OnboardingBoardData,
  OnboardingFormData,
  OnboardingRecord,
  OnboardingStatus,
} from '@/components/pages/client-onboarding/types';
import { api } from '@/lib/api';

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

const normalizeLeadData = (raw: unknown): LeadData | null => {
  if (!raw) return null;
  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as LeadData;
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== 'object') return null;
  const parsed = value as Record<string, unknown>;

  return {
    gymName: typeof parsed.gymName === 'string' ? parsed.gymName : '',
    gymLocation:
      typeof parsed.gymLocation === 'string' ? parsed.gymLocation : '',
    gymContactNumber:
      typeof parsed.gymContactNumber === 'string'
        ? parsed.gymContactNumber
        : '',
    country: typeof parsed.country === 'string' ? parsed.country : '',
    region: typeof parsed.region === 'string' ? parsed.region : '',
  };
};

const normalizeRecord = (
  record: Partial<OnboardingRecord>,
  fallbackStatus?: OnboardingStatus,
): OnboardingRecord => {
  const status =
    (record.status as OnboardingStatus | undefined) ?? fallbackStatus ?? 'lead';

  return {
    id: Number(record.id ?? 0),
    status,
    email: record.email ?? '',
    contactName: record.contactName ?? '',
    phoneNumber: record.phoneNumber ?? '',
    notes: record.notes ?? null,
    assignedAdminId: record.assignedAdminId ?? null,
    completedUserId: record.completedUserId ?? null,
    portalUsername: record.portalUsername ?? null,
    data: normalizeLeadData(record.data),
    createdAt: record.createdAt ?? '',
    updatedAt: record.updatedAt ?? '',
    completedAt: record.completedAt ?? null,
  };
};

const normalizeBoard = (
  payload: OnboardingBoardData | null | undefined,
): OnboardingBoardData | null => {
  if (!payload) return null;

  return {
    lead: payload.lead.map((record) => normalizeRecord(record, 'lead')),
    inProgress: payload.inProgress.map((record) =>
      normalizeRecord(record, 'in_progress'),
    ),
    pendingReview: payload.pendingReview.map((record) =>
      normalizeRecord(record, 'pending_review'),
    ),
    onHold: payload.onHold.map((record) => normalizeRecord(record, 'on_hold')),
    completed: payload.completed.map((record) =>
      normalizeRecord(record, 'completed'),
    ),
    cancelled: payload.cancelled.map((record) =>
      normalizeRecord(record, 'cancelled'),
    ),
  };
};

export const flattenBoard = (board: OnboardingBoardData) => [
  ...board.lead,
  ...board.inProgress,
  ...board.pendingReview,
  ...board.onHold,
  ...board.completed,
  ...board.cancelled,
];

export const fetchOnboardingBoard =
  async (): Promise<OnboardingBoardData | null> => {
    const response = await api.get<ApiEnvelope<OnboardingBoardData>>(
      '/ClientOnboarding/board',
    );
    return normalizeBoard(unwrap(response));
  };

export const fetchOnboardingRecord = async (
  id: number,
): Promise<OnboardingRecord> => {
  const response = await api.get<ApiEnvelope<OnboardingRecord>>(
    `/ClientOnboarding/${id}`,
  );
  return normalizeRecord(unwrap(response));
};

export type OnboardingDraftPayload = {
  email: string;
  contactName: string;
  phoneNumber: string;
  data: LeadData | string | null;
  notes: string;
  assignedAdminId: number | null;
};

export const createOnboardingDraft = async (
  payload: OnboardingDraftPayload,
) => {
  const requestPayload = {
    ...payload,
    data:
      payload.data && typeof payload.data !== 'string'
        ? JSON.stringify(payload.data)
        : payload.data,
  };
  const response = await api.post<ApiEnvelope<OnboardingRecord>>(
    '/ClientOnboarding/draft',
    requestPayload,
  );
  return normalizeRecord(unwrap(response));
};

export const updateOnboardingDraft = async (
  id: number,
  payload: OnboardingDraftPayload,
) => {
  const requestPayload = {
    ...payload,
    data:
      payload.data && typeof payload.data !== 'string'
        ? JSON.stringify(payload.data)
        : payload.data,
  };
  const response = await api.put<ApiEnvelope<OnboardingRecord>>(
    `/ClientOnboarding/${id}/draft`,
    requestPayload,
  );
  return normalizeRecord(unwrap(response));
};

export type OnboardingStatusPayload = {
  status: OnboardingStatus;
  notes?: string;
};

export const updateOnboardingStatus = async (
  id: number,
  payload: OnboardingStatusPayload,
) => {
  const response = await api.patch<ApiEnvelope<OnboardingRecord>>(
    `/ClientOnboarding/${id}/status`,
    payload,
  );
  return normalizeRecord(unwrap(response));
};

const buildGymPayload = (gym: GymDraft) => ({
  gymName: gym.gymName,
  gymEmail: gym.gymEmail,
  gymLocation: gym.gymLocation,
  gymContactNumber: gym.gymContactNumber,
  country: gym.country,
  region: gym.region,
});

export const buildCompleteFormData = (payload: OnboardingFormData) => {
  const formData = new FormData();
  const { account, subscription, gyms, lead } = payload;

  formData.append('UserName', account.userName);
  formData.append('Email', account.email || lead.email);
  formData.append('Password', account.password || '');
  formData.append('PhoneNumber', account.phoneNumber || lead.phoneNumber);

  if (subscription.subscriptionId) {
    formData.append('SubscriptionId', subscription.subscriptionId);
  }

  if (subscription.subscriptionDate) {
    formData.append('SubscriptionDate', subscription.subscriptionDate);
  }

  if (account.userPhotoFile) {
    formData.append('UserPhoto', account.userPhotoFile);
  }

  if (gyms.gyms.length > 0) {
    formData.append(
      'Gyms',
      JSON.stringify(gyms.gyms.map((gym) => buildGymPayload(gym))),
    );
  }

  const gymPhotos = gyms.gyms
    .map((gym) => gym.gymPhotoFile)
    .filter((photo): photo is File => photo instanceof File);

  if (gymPhotos.length > 0) {
    gymPhotos.forEach((photo) => {
      formData.append('GymPhotos', photo);
    });
  }

  return formData;
};

export const completeOnboarding = async (
  id: number,
  payload: OnboardingFormData,
) => {
  const formData = buildCompleteFormData(payload);
  const response = await api.post<ApiEnvelope<OnboardingRecord>>(
    `/ClientOnboarding/${id}/complete`,
    formData,
  );
  return normalizeRecord(unwrap(response));
};

const BOARD_QUERY_KEY = ['client-onboarding-board'];

export const useOnboardingBoard = () =>
  useQuery({
    queryKey: BOARD_QUERY_KEY,
    queryFn: fetchOnboardingBoard,
    staleTime: 1000 * 30,
  });

export const useOnboardingRecord = (id: number | null) =>
  useQuery({
    queryKey: ['client-onboarding', id],
    queryFn: () => fetchOnboardingRecord(Number(id)),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 30,
  });

export const useUpdateOnboardingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: OnboardingStatusPayload;
    }) => updateOnboardingStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEY });
    },
  });
};

export const useCreateOnboardingDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOnboardingDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEY });
    },
  });
};

export const useUpdateOnboardingDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: OnboardingDraftPayload;
    }) => updateOnboardingDraft(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEY });
    },
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: OnboardingFormData;
    }) => completeOnboarding(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_QUERY_KEY });
    },
  });
};
