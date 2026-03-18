import type { Metadata } from 'next';

import { SupportTicketsPage } from '@/components/pages/support-tickets';

export const metadata: Metadata = {
  title: 'Support Ticketing',
  description: 'Manage customer support tickets and escalations',
};

export default function SupportTicketsRoute() {
  return <SupportTicketsPage />;
}
