import type { Metadata } from 'next';

import { GymMembersPage } from '@/components/pages/gyms';
import { resolveRouteParams } from '@/lib/route-params';

export const metadata: Metadata = {
  title: 'Gym Members - KurlClub Admin',
  description: 'Member directory for client gyms',
};

export default async function GymMembersRoute({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await resolveRouteParams(params);
  const gymId = Number(resolvedParams.id);
  return <GymMembersPage gymId={gymId} />;
}
