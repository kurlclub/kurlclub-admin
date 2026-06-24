import type { Metadata } from 'next';

import { BannersPage } from '@/components/pages/content';

export const metadata: Metadata = {
  title: 'Banners - KurlClub Admin',
  description: 'Manage promotional banners',
};

export default function BannersRoute() {
  return <BannersPage />;
}
