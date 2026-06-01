import type { Metadata } from 'next';

import { BlogEditorPage } from '@/components/pages/social/blogs';

export const metadata: Metadata = {
  title: 'Edit Article - KurlClub Admin',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: Props) {
  const { slug } = await params;
  return <BlogEditorPage mode="edit" slug={slug} />;
}
