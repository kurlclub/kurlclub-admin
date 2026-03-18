import type { ReactNode } from 'react';

import { SupportTicketsProvider } from '@/components/pages/support-tickets';

export default function SupportTicketsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SupportTicketsProvider>{children}</SupportTicketsProvider>;
}
