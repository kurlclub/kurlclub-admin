import type { Metadata } from 'next';

import { BlogEditorPage } from '@/components/pages/social/blogs';

export const metadata: Metadata = {
  title: 'New Article - KurlClub Admin',
};

export default function NewBlogPage() {
  return <BlogEditorPage mode="create" />;
}
