import type { Metadata } from 'next';

import { GymDetailsPage } from '@/components/pages/gyms';
import { resolveRouteParams } from '@/lib/route-params';

export const metadata: Metadata = {
  title: 'Gym Details - KurlClub Admin',
  description: 'Client gym profile and member summary',
};

export default async function GymDetailsRoute({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await resolveRouteParams(params);
  const gymId = Number(resolvedParams.id);
  return <GymDetailsPage gymId={gymId} />;
}
