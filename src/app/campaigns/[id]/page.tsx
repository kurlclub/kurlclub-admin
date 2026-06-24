import type { Metadata } from 'next';

import { CampaignDetailPage } from '@/components/pages/campaigns';

export const metadata: Metadata = {
  title: 'Campaign - KurlClub Admin',
  description: 'Campaign performance and delivery',
};

export default function CampaignDetailRoute() {
  return <CampaignDetailPage />;
}
