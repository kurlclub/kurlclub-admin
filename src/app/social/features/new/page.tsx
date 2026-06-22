import type { Metadata } from 'next';

import { FeatureEditorPage } from '@/components/pages/social/features';

export const metadata: Metadata = {
  title: 'New Feature - KurlClub Admin',
};

export default function NewFeaturePage() {
  return <FeatureEditorPage mode="create" />;
}
