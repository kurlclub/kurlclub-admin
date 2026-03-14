import type { Metadata } from 'next';

import { MembersLandingPage } from '@/components/pages/members';

export const metadata: Metadata = {
  title: 'Members - KurlClub Admin',
  description: 'Search member profiles',
};

export default function MembersPage() {
  return <MembersLandingPage />;
}
