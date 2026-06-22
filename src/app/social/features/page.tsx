import type { Metadata } from 'next';

import { FeatureListPage } from '@/components/pages/social/features';

export const metadata: Metadata = {
  title: 'Features - KurlClub Admin',
  description: 'Manage feature announcements for kurlclub.com',
};

export default function FeaturesPage() {
  return <FeatureListPage />;
}
