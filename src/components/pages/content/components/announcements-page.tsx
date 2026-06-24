'use client';

import { useState } from 'react';

import { Button, Sheet } from '@kurlclub/ui-components';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

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

          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
            <Sparkles className="h-8 w-8 text-secondary-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">
                No announcements yet
              </p>
              <p className="mt-1 text-sm text-secondary-blue-300">
                Announcements will appear here once the backend is connected.
              </p>
            </div>
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
