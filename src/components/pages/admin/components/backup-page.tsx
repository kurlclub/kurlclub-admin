'use client';

import { Button } from '@kurlclub/ui-components';
import { DatabaseBackup } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

const STUB = 'Will be enabled once the backend is connected';

export function BackupPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Data Backup & Restore</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Create and restore platform data backups
            </p>
          </div>
          <Button className="gap-2" onClick={() => toast.info(STUB)}>
            <DatabaseBackup className="h-4 w-4" />
            Create Backup
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
          <DatabaseBackup className="h-8 w-8 text-secondary-blue-300" />
          <div>
            <p className="text-sm font-medium text-white">No backups yet</p>
            <p className="mt-1 text-sm text-secondary-blue-300">
              Backups will appear here once the backend is connected.
            </p>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
