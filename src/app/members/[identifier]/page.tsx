import type { Metadata } from 'next';

import { MemberDetailsPage } from '@/components/pages/members';
import { resolveRouteParams } from '@/lib/route-params';

export const metadata: Metadata = {
  title: 'Member Details - KurlClub Admin',
  description: 'Member profile and membership details',
};

export default async function MemberDetailsRoute({
  params,
}: {
  params: { identifier: string } | Promise<{ identifier: string }>;
}) {
  const resolvedParams = await resolveRouteParams(params);
  return <MemberDetailsPage identifier={resolvedParams.identifier} />;
}
