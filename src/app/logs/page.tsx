import type { Metadata } from 'next';

import { LogsPage } from '@/components/pages/logs';

export const metadata: Metadata = {
  title: 'Logs & Analytics - KurlClub Admin',
  description: 'Activity, audit, and system usage logs',
};

export default function LogsRoute() {
  return <LogsPage />;
}
