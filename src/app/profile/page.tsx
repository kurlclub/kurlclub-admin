import type { Metadata } from 'next';

import { ProfilePage } from '@/components/pages/profile';

export const metadata: Metadata = {
  title: 'Profile - KurlClub Admin',
  description: 'Manage your internal team profile',
};

export default function ProfileRoute() {
  return <ProfilePage />;
}
