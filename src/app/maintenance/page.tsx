import type { Metadata } from 'next';

import { MaintenancePage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Maintenance Mode - KurlClub Admin',
  description: 'Maintenance mode and announcement banner',
};

export default function MaintenanceRoute() {
  return <MaintenancePage />;
}
