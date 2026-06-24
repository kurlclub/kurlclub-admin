import type { Metadata } from 'next';

import { PushNotificationsPage } from '@/components/pages/campaigns';

export const metadata: Metadata = {
  title: 'Push Notifications - KurlClub Admin',
  description: 'Send push notifications to users',
};

export default function NotificationsRoute() {
  return <PushNotificationsPage />;
}
