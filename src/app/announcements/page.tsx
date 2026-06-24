import type { Metadata } from 'next';

import { AnnouncementsPage } from '@/components/pages/content';

export const metadata: Metadata = {
  title: 'Announcement Center - KurlClub Admin',
  description: 'Publish announcements to clients and gyms',
};

export default function AnnouncementsRoute() {
  return <AnnouncementsPage />;
}
