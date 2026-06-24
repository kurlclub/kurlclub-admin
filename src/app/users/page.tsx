import type { Metadata } from 'next';

import { UsersListPage } from '@/components/pages/users';

export const metadata: Metadata = {
  title: 'Users - KurlClub Admin',
  description: 'Manage admin users, passwords, and roles',
};

export default function UsersRoute() {
  return <UsersListPage />;
}
