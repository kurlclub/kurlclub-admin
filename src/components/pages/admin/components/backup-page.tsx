'use client';

import { Badge, Button } from '@kurlclub/ui-components';
import { DatabaseBackup } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoBackups } from '@/lib/demo-data';

const STUB = 'Will be enabled once the backend is connected';

const fmtDate = (iso: string) => new Date(iso).toLocaleString();

export function BackupPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Data Backup & Restore
            </h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Create and restore platform data backups
            </p>
          </div>
          <Button className="gap-2" onClick={() => toast.info(STUB)}>
            <DatabaseBackup className="h-4 w-4" />
            Create Backup
          </Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                <th className="px-5 py-3 font-medium">Created</th>
                <th className="px-5 py-3 font-medium">Size</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {demoBackups.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-secondary-blue-400/50 last:border-0"
                >
                  <td className="px-5 py-3 text-white">{fmtDate(b.createdAt)}</td>
                  <td className="px-5 py-3 text-secondary-blue-100">{b.size}</td>
                  <td className="px-5 py-3 text-secondary-blue-100">{b.type}</td>
                  <td className="px-5 py-3">
                    <Badge variant="info">{b.status}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={b.status !== 'Completed'}
                      onClick={() => toast.info(STUB)}
                    >
                      Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </StudioLayout>
  );
}
