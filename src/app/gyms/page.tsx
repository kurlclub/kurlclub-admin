import type { Metadata } from 'next';

import { GymListPage } from '@/components/pages/gyms';

export const metadata: Metadata = {
  title: 'Gyms - KurlClub Admin',
  description: 'Manage client gym locations in the internal CRM',
};

export default function GymsPage() {
  return <GymListPage />;
}
