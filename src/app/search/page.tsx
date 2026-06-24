import type { Metadata } from 'next';

import { GlobalSearchPage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Global Search - KurlClub Admin',
  description: 'Search across clients and gyms',
};

export default function SearchRoute() {
  return <GlobalSearchPage />;
}
