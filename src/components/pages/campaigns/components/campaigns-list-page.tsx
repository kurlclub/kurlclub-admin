'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Sheet,
} from '@kurlclub/ui-components';
import { Megaphone, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

import {
  type CampaignRow,
  createCampaignsColumns,
} from '../table/campaigns-columns';
import { AudienceFields } from './audience-fields';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const CHANNELS = [
  { value: 'push', label: 'Push' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'in_app', label: 'In-app' },
];

export function CampaignsListPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [scheduleLater, setScheduleLater] = useState(false);

  // No backend yet — empty-state shell.
  const data: CampaignRow[] = [];

  const columns = useMemo(
    () =>
      createCampaignsColumns({
        onView: (id) => router.push(`/campaigns/${id}`),
      }),
    [router],
  );

  const handleCreate = () => {
    toast.info('Will be enabled once the backend is connected');
    setIsCreating(false);
  };

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Campaigns</h1>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Create and track marketing campaigns across channels
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          </div>

          {data.length > 0 ? (
            <DataTable
              columns={columns}
              data={data}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  searchPlaceholder="Search campaigns..."
                />
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
              <Megaphone className="h-8 w-8 text-secondary-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">
                  No campaigns yet
                </p>
                <p className="mt-1 text-sm text-secondary-blue-300">
                  Campaigns will appear here once the backend is connected.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/campaigns/1')}
              >
                Preview campaign performance
              </Button>
            </div>
          )}
        </div>
      </StudioLayout>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create Campaign"
        description="Set up a new marketing campaign"
        width="lg"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Campaign</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Details
            </h3>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">
                  Campaign Name
                </span>
                <input className={inputClass} placeholder="e.g. Summer Offer" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">Channel</span>
                <select className={inputClass} defaultValue="push">
                  {CHANNELS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Audience
            </h3>
            <AudienceFields />
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Content
            </h3>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">Title</span>
                <input className={inputClass} />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">Message</span>
                <textarea className={inputClass} rows={3} />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Schedule
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-secondary-blue-200">
                <input
                  type="checkbox"
                  checked={scheduleLater}
                  onChange={(e) => setScheduleLater(e.target.checked)}
                />
                Schedule for later (otherwise sends now)
              </label>
              {scheduleLater && (
                <label className="block space-y-1.5">
                  <span className="text-sm text-secondary-blue-200">
                    Send at
                  </span>
                  <input type="datetime-local" className={inputClass} />
                </label>
              )}
            </div>
          </section>
        </div>
      </Sheet>
    </>
  );
}
