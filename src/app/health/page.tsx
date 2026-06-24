import type { Metadata } from 'next';

import { HealthPage } from '@/components/pages/health';

export const metadata: Metadata = {
  title: 'System Health - KurlClub Admin',
  description: 'Service status, uptime, and failure alerts',
};

export default function HealthRoute() {
  return <HealthPage />;
}
