'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Badge, Button, Sheet } from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { useSubscriptions } from '@/services/subscription';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const CYCLES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'six_months', label: '6 Months' },
  { value: 'yearly', label: 'Yearly' },
];

type SheetKind =
  | 'upgrade'
  | 'change-plan'
  | 'renew'
  | 'extend-trial'
  | 'cancel'
  | null;

const STUB = 'Will be enabled once the backend is connected';

const DetailField = ({ label }: { label: string }) => (
  <div>
    <p className="text-xs text-secondary-blue-300">{label}</p>
    <p className="mt-0.5 text-sm text-white">—</p>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
      {title}
    </h2>
    {children}
  </section>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-1.5">
    <span className="text-sm text-secondary-blue-200">{label}</span>
    {children}
  </label>
);

export function SubscriptionDetailPage() {
  const router = useRouter();
  const { data: plans } = useSubscriptions();
  const [sheet, setSheet] = useState<SheetKind>(null);

  const close = () => setSheet(null);
  const submitStub = () => {
    toast.info(STUB);
    close();
  };

  const planOptions = plans ?? [];

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">Subscription</h1>
                  <Badge variant="info">—</Badge>
                </div>
                <p className="mt-1 text-sm text-secondary-blue-200">
                  Manage this client&apos;s subscription lifecycle
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => setSheet('upgrade')}>
                Upgrade
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSheet('change-plan')}>
                Change Plan
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSheet('renew')}>
                Renew
              </Button>
              <Button size="sm" variant="outline" onClick={() => setSheet('extend-trial')}>
                Extend Trial
              </Button>
              <Button size="sm" variant="destructive" onClick={() => setSheet('cancel')}>
                Cancel
              </Button>
            </div>
          </div>

          {/* Overview */}
          <Section title="Overview">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              <DetailField label="Client" />
              <DetailField label="Plan" />
              <DetailField label="Status" />
              <DetailField label="Billing Cycle" />
              <DetailField label="Amount" />
              <DetailField label="Started" />
              <DetailField label="Renews / Ends" />
              <DetailField label="Trial Ends" />
            </div>
          </Section>

          {/* History */}
          <Section title="Subscription History">
            <p className="py-6 text-center text-sm text-secondary-blue-300">
              No subscription history yet.
            </p>
          </Section>
        </div>
      </StudioLayout>

      {/* Upgrade */}
      <Sheet
        isOpen={sheet === 'upgrade'}
        onClose={close}
        title="Upgrade Subscription"
        description="Move this client to a higher plan"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Upgrade</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="New Plan">
            <select className={inputClass} defaultValue="">
              <option value="" disabled>
                Select a plan
              </option>
              {planOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Note (optional)">
            <textarea className={inputClass} rows={3} />
          </Field>
        </div>
      </Sheet>

      {/* Change Plan */}
      <Sheet
        isOpen={sheet === 'change-plan'}
        onClose={close}
        title="Change Plan"
        description="Switch plan or billing cycle"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Apply Change</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Plan">
            <select className={inputClass} defaultValue="">
              <option value="" disabled>
                Select a plan
              </option>
              {planOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Billing Cycle">
            <select className={inputClass} defaultValue="monthly">
              {CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Note (optional)">
            <textarea className={inputClass} rows={3} />
          </Field>
        </div>
      </Sheet>

      {/* Renew */}
      <Sheet
        isOpen={sheet === 'renew'}
        onClose={close}
        title="Renew Subscription"
        description="Start a new billing period"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Renew</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Billing Cycle">
            <select className={inputClass} defaultValue="monthly">
              {CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Note (optional)">
            <textarea className={inputClass} rows={3} />
          </Field>
        </div>
      </Sheet>

      {/* Extend Trial */}
      <Sheet
        isOpen={sheet === 'extend-trial'}
        onClose={close}
        title="Extend Trial"
        description="Set a new trial end date"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Extend Trial</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="New Trial End Date">
            <input type="date" className={inputClass} />
          </Field>
          <Field label="Note (optional)">
            <textarea className={inputClass} rows={3} />
          </Field>
        </div>
      </Sheet>

      {/* Cancel / Deactivate */}
      <Sheet
        isOpen={sheet === 'cancel'}
        onClose={close}
        title="Cancel Subscription"
        description="This stops auto-renewal for the client"
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={close}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={submitStub}>
              Confirm Cancel
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Reason">
            <textarea
              className={inputClass}
              rows={3}
              placeholder="Why is this subscription being cancelled?"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-secondary-blue-200">
            <input type="checkbox" />
            Cancel immediately (otherwise at period end)
          </label>
        </div>
      </Sheet>
    </>
  );
}
