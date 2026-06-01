import type { Metadata } from 'next';

import { BlogListPage } from '@/components/pages/social/blogs';

export const metadata: Metadata = {
  title: 'Blogs - KurlClub Admin',
  description: 'Manage blog content for kurlclub.com',
};

export default function BlogsPage() {
  return <BlogListPage />;
}
