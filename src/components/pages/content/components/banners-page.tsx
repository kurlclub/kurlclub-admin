'use client';

import { useState } from 'react';

import { Button, Sheet } from '@kurlclub/ui-components';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

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

          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
            <ImageIcon className="h-8 w-8 text-secondary-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">No banners yet</p>
              <p className="mt-1 text-sm text-secondary-blue-300">
                Banners will appear here once the backend is connected.
              </p>
            </div>
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
