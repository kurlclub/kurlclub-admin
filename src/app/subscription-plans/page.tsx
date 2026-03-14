import type { Metadata } from 'next';

import { SubscriptionListPage } from '@/components/pages/subscription-plans';

export const metadata: Metadata = {
  title: 'Subscriptions - KurlClub Admin',
  description: 'Manage platform subscription plans',
};

export default function SubscriptionPlansPage() {
  return <SubscriptionListPage />;
}
