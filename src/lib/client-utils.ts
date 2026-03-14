import type { Client } from '@/types/client';

export const resolveClientId = (client: Client) =>
  client.id ?? client.clientId ?? client.userId;
