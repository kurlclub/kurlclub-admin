import type { Metadata } from 'next';

import { AuditLogsPage } from '@/components/pages/audit';

export const metadata: Metadata = {
  title: 'Audit Logs - KurlClub Admin',
  description: 'Suspension history and administrative audit logs',
};

export default function AuditRoute() {
  return <AuditLogsPage />;
}
