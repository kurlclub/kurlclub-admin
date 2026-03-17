import type { Metadata } from 'next';

import { ClientListPage } from '@/components/pages/clients';

export const metadata: Metadata = {
  title: 'Clients - KurlClub Admin',
  description: 'Manage client accounts and subscriptions in the internal CRM',
};

export default function ClientsPage() {
  return <ClientListPage />;
}
