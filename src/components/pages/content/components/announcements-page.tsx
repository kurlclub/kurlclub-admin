'use client';

import { useState } from 'react';

import { Badge, Button, Sheet } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoAnnouncements } from '@/lib/demo-data';

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString() : '—';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const STUB = 'Will be enabled once the backend is connected';

const AUDIENCES = [
  { value: 'all', label: 'All users' },
  { value: 'clients', label: 'Clients' },
  { value: 'gyms', label: 'Gyms' },
];

export function AnnouncementsPage() {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    toast.info(STUB);
    setIsCreating(false);
  };

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Announcement Center
              </h1>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Publish announcements to clients and gyms
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Audience</th>
                  <th className="px-5 py-3 font-medium">Published</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoAnnouncements.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-secondary-blue-400/50 last:border-0"
                  >
                    <td className="px-5 py-3 text-white">{a.title}</td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {a.audience}
                    </td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {fmtDate(a.publishedAt)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="info">{a.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </StudioLayout>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="New Announcement"
        description="Draft and publish an announcement"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Publish</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Title</span>
            <input className={inputClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Message</span>
            <textarea className={inputClass} rows={4} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Audience</span>
            <select className={inputClass} defaultValue="all">
              {AUDIENCES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Sheet>
    </>
  );
}
