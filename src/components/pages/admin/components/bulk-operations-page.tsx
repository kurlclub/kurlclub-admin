'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoUsers } from '@/lib/demo-data';

export function BulkOperationsPage() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === demoUsers.length ? [] : demoUsers.map((u) => u.id),
    );

  const run = (action: string) => {
    if (!selected.length) return;
    toast.info(
      `${action} ${selected.length} user(s) — connect backend to apply`,
    );
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Bulk Operations</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Select users and apply actions in bulk
          </p>
        </div>

        {/* Bulk action bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-3">
          <span className="px-2 text-sm text-secondary-blue-300">
            {selected.length} selected
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!selected.length}
              onClick={() => run('Suspend')}
            >
              Suspend
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!selected.length}
              onClick={() => run('Reactivate')}
            >
              Reactivate
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!selected.length}
              onClick={() => run('Notify')}
            >
              Notify
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                <th className="px-5 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === demoUsers.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoUsers.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-secondary-blue-400/50 last:border-0"
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(u.id)}
                      onChange={() => toggle(u.id)}
                    />
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-white">{u.name}</span>
                    <span className="ml-2 text-xs text-secondary-blue-300">
                      {u.email}
                    </span>
                  </td>
                  <td className="px-5 py-3 capitalize text-secondary-blue-100">
                    {u.role.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3 capitalize text-secondary-blue-100">
                    {u.status}
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
