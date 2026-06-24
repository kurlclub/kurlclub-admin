import type { Metadata } from 'next';

import { CampaignsListPage } from '@/components/pages/campaigns';

export const metadata: Metadata = {
  title: 'Email Campaigns - KurlClub Admin',
  description: 'Create and track email campaigns',
};

export default function EmailCampaignsRoute() {
  return (
    <CampaignsListPage
      title="Email Campaigns"
      description="Create and track email campaigns"
      channelPreset="email"
    />
  );
}
