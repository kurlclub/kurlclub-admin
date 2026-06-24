import type { Metadata } from 'next';

import { BulkOperationsPage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Bulk Operations - KurlClub Admin',
  description: 'Apply actions to users in bulk',
};

export default function BulkOperationsRoute() {
  return <BulkOperationsPage />;
}
