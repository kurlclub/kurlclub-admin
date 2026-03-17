'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@kurlclub/ui-components';
import { ShieldAlert } from 'lucide-react';

export function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-secondary-blue-400/40 bg-secondary-blue-700/40 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-alert-red-400/40 bg-alert-red-500/10 text-alert-red-300">
        <ShieldAlert className="h-5 w-5" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">Access restricted</p>
        <p className="mt-1 text-sm text-secondary-blue-200">
          You don&apos;t have permission to view this page.
        </p>
      </div>
      <Button variant="outline" onClick={() => router.push('/dashboard')}>
        Back to overview
      </Button>
    </div>
  );
}
