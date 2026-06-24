import type { Metadata } from 'next';

import { CouponsPage } from '@/components/pages/content';

export const metadata: Metadata = {
  title: 'Offers & Coupons - KurlClub Admin',
  description: 'Manage promotional offers and coupons',
};

export default function CouponsRoute() {
  return <CouponsPage />;
}
