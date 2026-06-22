import type { Metadata } from 'next';

import { FeatureEditorPage } from '@/components/pages/social/features';

export const metadata: Metadata = {
  title: 'Edit Feature - KurlClub Admin',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditFeaturePage({ params }: Props) {
  const { id } = await params;
  return <FeatureEditorPage mode="edit" id={Number(id)} />;
}
