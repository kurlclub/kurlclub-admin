import type { Metadata } from 'next';

import { ClientListPage } from '@/components/pages/clients';

export const metadata: Metadata = {
  title: 'Clients - KurlClub Admin',
  description: 'Manage clients and subscriptions',
};

export default function ClientsPage() {
  return <ClientListPage />;
}
