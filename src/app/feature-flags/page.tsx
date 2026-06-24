import type { Metadata } from 'next';

import { FeatureFlagsPage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Feature Flags - KurlClub Admin',
  description: 'Toggle platform features',
};

export default function FeatureFlagsRoute() {
  return <FeatureFlagsPage />;
}
