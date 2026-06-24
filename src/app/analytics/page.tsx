import type { Metadata } from 'next';

import { AnalyticsPage } from '@/components/pages/analytics';

export const metadata: Metadata = {
  title: 'Analytics - KurlClub Admin',
  description: 'Conversion, churn, and trial-to-paid analytics',
};

export default function AnalyticsRoute() {
  return <AnalyticsPage />;
}
