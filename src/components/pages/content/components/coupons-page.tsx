'use client';

import { useState } from 'react';

import { Badge, Button, Sheet } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoCoupons } from '@/lib/demo-data';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const STUB = 'Will be enabled once the backend is connected';

export function CouponsPage() {
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
                Offers & Coupons
              </h1>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Create promotional offers and discount coupons
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Coupon
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Discount</th>
                  <th className="px-5 py-3 font-medium">Redeemed</th>
                  <th className="px-5 py-3 font-medium">Validity</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoCoupons.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-secondary-blue-400/50 last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-white">
                      {c.code}
                    </td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {c.type}
                    </td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {c.redeemed} / {c.max}
                    </td>
                    <td className="px-5 py-3 text-secondary-blue-100">
                      {c.validity}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="info">
                        {c.active ? 'Active' : 'Disabled'}
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
        title="Create Coupon"
        description="Add a discount coupon"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Coupon</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">Code</span>
            <input className={inputClass} placeholder="e.g. SUMMER20" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">Type</span>
              <select className={inputClass} defaultValue="percent">
                <option value="percent">Percentage</option>
                <option value="flat">Flat amount</option>
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">Value</span>
              <input type="number" className={inputClass} />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">
              Max Redemptions (optional)
            </span>
            <input type="number" className={inputClass} />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">
                Valid From
              </span>
              <input type="date" className={inputClass} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">Valid To</span>
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
