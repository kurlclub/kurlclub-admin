import type { Metadata } from 'next';

import { SubscriptionsListPage } from '@/components/pages/subscriptions';

export const metadata: Metadata = {
  title: 'Subscriptions - KurlClub Admin',
  description: 'Manage client subscriptions',
};

export default function SubscriptionsRoute() {
  return <SubscriptionsListPage />;
}
