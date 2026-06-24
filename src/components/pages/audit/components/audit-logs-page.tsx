'use client';

import { DataTable, DataTableToolbar } from '@kurlclub/ui-components';
import { ScrollText } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

import { type AuditRow, auditColumns } from '../table/audit-columns';

export function AuditLogsPage() {
  // No backend yet — empty-state shell.
  const data: AuditRow[] = [];

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Suspension history and administrative actions across the platform
          </p>
        </div>

        {data.length > 0 ? (
          <DataTable
            columns={auditColumns}
            data={data}
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchPlaceholder="Search audit logs..."
              />
            )}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
            <ScrollText className="h-8 w-8 text-secondary-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">No audit logs yet</p>
              <p className="mt-1 text-sm text-secondary-blue-300">
                Suspension and admin activity will appear here once the backend
                is connected.
              </p>
            </div>
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
