import type { Metadata } from 'next';

import { ClientDetailsPage } from '@/components/pages/clients';
import { resolveRouteParams } from '@/lib/route-params';

export const metadata: Metadata = {
  title: 'Client Details - KurlClub Admin',
  description: 'Client profile and gym management',
};

export default async function ClientDetailsRoute({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await resolveRouteParams(params);
  return <ClientDetailsPage clientId={resolvedParams.id} />;
}
