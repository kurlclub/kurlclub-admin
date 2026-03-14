import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { Client, ClientDetails } from '@/types/client';

interface ApiResponse<T> {
  data?: T;
}

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data as T;
  }
  return payload as T;
};

const normalizeClientList = (payload: unknown): Client[] => {
  if (Array.isArray(payload)) return payload as Client[];
  if (payload && typeof payload === 'object') {
    const maybeClients = (payload as { clients?: Client[] }).clients;
    if (Array.isArray(maybeClients)) return maybeClients;
    const maybeItems = (payload as { items?: Client[] }).items;
    if (Array.isArray(maybeItems)) return maybeItems;
  }
  return [];
};

export const fetchClients = async () => {
  const response = await api.get<ApiResponse<Client[]> | Client[]>('/Client');
  return normalizeClientList(unwrap(response));
};

export const fetchClientById = async (id: number) => {
  const response = await api.get<ApiResponse<ClientDetails> | ClientDetails>(
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

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5,
  });
};

export const useClient = (id: number) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => fetchClientById(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 5,
  });
};
