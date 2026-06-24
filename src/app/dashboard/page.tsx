import type { Metadata } from 'next';

import { DashboardPage } from '@/components/pages/dashboard';

export const metadata: Metadata = {
  title: 'Revenue Dashboard - KurlClub Admin',
  description: 'Recurring revenue, plan mix, and top performers',
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
