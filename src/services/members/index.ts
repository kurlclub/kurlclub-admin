import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { MemberDetails } from '@/types/member';

interface ApiResponse<T> {
  data?: T;
}

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data as T;
  }
  return payload as T;
};

export const fetchMemberByIdentifier = async (identifier: string) => {
  const response = await api.get<ApiResponse<MemberDetails> | MemberDetails>(
    `/Members/identifier/${identifier}`,
  );
  const payload = unwrap(response) as
    | MemberDetails
    | { member?: MemberDetails };
  if (payload && typeof payload === 'object' && 'member' in payload) {
    return (payload as { member?: MemberDetails }).member as MemberDetails;
  }
  return payload as MemberDetails;
};

export const useMember = (identifier: string) => {
  return useQuery({
    queryKey: ['member', identifier],
    queryFn: () => fetchMemberByIdentifier(identifier),
    enabled: Boolean(identifier),
    staleTime: 1000 * 60 * 5,
  });
};
