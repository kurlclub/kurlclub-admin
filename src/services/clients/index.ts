import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { type ApiEnvelope, STALE_5M, unwrap } from '@/lib/api-types';
import type { Client, ClientDetails } from '@/types/client';

const normalizeClientList = (payload: unknown): Client[] => {
  if (Array.isArray(payload)) return payload as Client[];
  if (payload && typeof payload === 'object') {
    const asRecord = payload as Record<string, unknown>;
    if (Array.isArray(asRecord.clients)) return asRecord.clients as Client[];
    if (Array.isArray(asRecord.items)) return asRecord.items as Client[];
  }
  return [];
};

export const fetchClients = async () => {
  const response = await api.get<ApiEnvelope<Client[]> | Client[]>('/Client');
  return normalizeClientList(unwrap(response));
};

export const fetchClientById = async (id: number) => {
  const response = await api.get<ApiEnvelope<ClientDetails> | ClientDetails>(
    `/Client/${id}`,
  );
  const payload = unwrap(response) as
    | ClientDetails
    | { client?: ClientDetails };
  if (payload && typeof payload === 'object' && 'client' in payload) {
    return (payload as { client?: ClientDetails }).client as ClientDetails;
  }
  return payload as ClientDetails;
};

export const useClients = () =>
  useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: STALE_5M,
  });

export const useClient = (id: number) =>
  useQuery({
    queryKey: ['client', id],
    queryFn: () => fetchClientById(id),
    enabled: Number.isFinite(id),
    staleTime: STALE_5M,
  });
