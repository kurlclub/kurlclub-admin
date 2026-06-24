import type { Metadata } from 'next';

import { CampaignsListPage } from '@/components/pages/campaigns';

export const metadata: Metadata = {
  title: 'Campaigns - KurlClub Admin',
  description: 'Create and track marketing campaigns',
};

export default function CampaignsRoute() {
  return <CampaignsListPage />;
}
