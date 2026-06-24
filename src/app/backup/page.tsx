import type { Metadata } from 'next';

import { BackupPage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Backup & Restore - KurlClub Admin',
  description: 'Create and restore data backups',
};

export default function BackupRoute() {
  return <BackupPage />;
}
