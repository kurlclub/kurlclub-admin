import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { STALE_5M, unwrap, type ApiEnvelope } from '@/lib/api-types';
import type { MemberDetails } from '@/types/member';

export const fetchMemberByIdentifier = async (identifier: string) => {
  const response = await api.get<ApiEnvelope<MemberDetails> | MemberDetails>(
    `/Members/identifier/${identifier}`,
  );
  const payload = unwrap(response) as MemberDetails | { member?: MemberDetails };
  if (payload && typeof payload === 'object' && 'member' in payload) {
    return (payload as { member?: MemberDetails }).member as MemberDetails;
  }
  return payload as MemberDetails;
};

export const useMember = (identifier: string) =>
  useQuery({
    queryKey: ['member', identifier],
    queryFn: () => fetchMemberByIdentifier(identifier),
    enabled: Boolean(identifier),
    staleTime: STALE_5M,
  });
