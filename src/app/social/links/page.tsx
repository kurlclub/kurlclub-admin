import type { Metadata } from 'next';

import { StudioLayout } from '@/components/shared/layout';

export const metadata: Metadata = {
  title: 'Links - KurlClub Admin',
};

export default function LinksPage() {
  return (
    <StudioLayout>
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <h1 className="text-2xl font-bold text-white">Links</h1>
        <p className="mt-2 text-sm text-secondary-blue-300">
          links.kurlclub.com analytics coming soon.
        </p>
      </div>
    </StudioLayout>
  );
}
