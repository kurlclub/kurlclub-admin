import type { Metadata } from 'next';

import { DeveloperTicketsPage } from '@/components/pages/support-tickets';

export const metadata: Metadata = {
  title: 'Developer Tickets',
  description: 'Code-level issues requiring development team attention',
};

export default function DeveloperTicketsRoute() {
  return <DeveloperTicketsPage />;
}
