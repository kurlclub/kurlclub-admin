import type { Metadata } from 'next';

import { CampaignsListPage } from '@/components/pages/campaigns';

export const metadata: Metadata = {
  title: 'WhatsApp Campaigns - KurlClub Admin',
  description: 'Create and track WhatsApp campaigns',
};

export default function WhatsAppCampaignsRoute() {
  return (
    <CampaignsListPage
      title="WhatsApp Campaigns"
      description="Create and track WhatsApp campaigns"
      channelPreset="whatsapp"
    />
  );
}
