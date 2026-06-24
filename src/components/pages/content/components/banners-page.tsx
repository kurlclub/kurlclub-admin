'use client';

import { useState } from 'react';

import { Badge, Button, Sheet } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoBanners } from '@/lib/demo-data';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const STUB = 'Will be enabled once the backend is connected';

const PLACEMENTS = [
  { value: 'home_hero', label: 'Home hero' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'login', label: 'Login' },
  { value: 'promo_strip', label: 'Promo strip' },
];

export function BannersPage() {
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
              <h1 className="text-2xl font-bold text-white">Banners</h1>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Manage promotional banners across the app
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Banner
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Placement</th>
                  <th className="px-5 py-3 font-medium">Schedule</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoBanners.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-secondary-blue-400/50 last:border-0"
                  >
                    <td className="px-5 py-3 text-white">{b.title}</td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {b.placement}
                    </td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {b.window}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="info">
                        {b.active ? 'Active' : 'Disabled'}
                      </Badge>
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
        title="Create Banner"
        description="Add a promotional banner"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Banner</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Title</span>
            <input className={inputClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Image URL</span>
            <input className={inputClass} placeholder="https://..." />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Placement</span>
            <select className={inputClass} defaultValue="home_hero">
              {PLACEMENTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">
              Link URL (optional)
            </span>
            <input className={inputClass} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">Starts</span>
              <input type="date" className={inputClass} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">Ends</span>
              <input type="date" className={inputClass} />
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-secondary-blue-200">
            <input type="checkbox" defaultChecked />
            Active
          </label>
        </div>
      </Sheet>
    </>
  );
}
