import type { Metadata } from 'next';

import { SubscriptionDetailPage } from '@/components/pages/subscriptions';

export const metadata: Metadata = {
  title: 'Subscription - KurlClub Admin',
  description: 'Manage a client subscription lifecycle',
};

export default function SubscriptionDetailRoute() {
  return <SubscriptionDetailPage />;
}
