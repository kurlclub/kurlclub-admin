import type { Metadata } from 'next';

import { ImpersonatePage } from '@/components/pages/admin';

export const metadata: Metadata = {
  title: 'Impersonate User - KurlClub Admin',
  description: 'Sign in as a client (Super Admin only)',
};

export default function ImpersonateRoute() {
  return <ImpersonatePage />;
}
