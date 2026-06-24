'use client';

import { Button } from '@kurlclub/ui-components';
import { Wrench } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

const STUB = 'Will be enabled once the backend is connected';

export function BulkOperationsPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bulk Operations</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Select users and apply actions in bulk
          </p>
        </div>

        {/* Bulk action bar (disabled until rows are selectable) */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-3">
          <span className="px-2 text-sm text-secondary-blue-300">
            0 selected
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(STUB)}
            >
              Suspend
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(STUB)}
            >
              Reactivate
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(STUB)}
            >
              Notify
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
          <Wrench className="h-8 w-8 text-secondary-blue-300" />
          <div>
            <p className="text-sm font-medium text-white">
              No users to operate on yet
            </p>
            <p className="mt-1 text-sm text-secondary-blue-300">
              A selectable user list will appear here once the backend is
              connected.
            </p>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
