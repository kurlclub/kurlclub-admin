'use client';

import { useState } from 'react';

import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

const STUB = 'Will be enabled once the backend is connected';

const FLAGS = [
  {
    key: 'new_dashboard',
    name: 'New Dashboard',
    description: 'Revamped analytics dashboard.',
  },
  {
    key: 'whatsapp_broadcast',
    name: 'WhatsApp Broadcast',
    description: 'Bulk WhatsApp campaigns to members.',
  },
  {
    key: 'razorpay_billing',
    name: 'Razorpay Billing',
    description: 'Live payment gateway for subscriptions.',
  },
  {
    key: 'self_serve_signup',
    name: 'Self-serve Signup',
    description: 'Gym owners onboard without sales.',
  },
];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition ${
        on
          ? 'border-primary-green-500 bg-primary-green-500/30'
          : 'border-secondary-blue-400 bg-secondary-blue-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full transition ${
          on
            ? 'translate-x-6 bg-primary-green-500'
            : 'translate-x-1 bg-secondary-blue-200'
        }`}
      />
    </button>
  );
}

export function FeatureFlagsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.info(STUB);
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Feature Flags</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Toggle platform features on or off
          </p>
        </div>

        <section className="divide-y divide-secondary-blue-400/60 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
          {FLAGS.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between gap-4 p-5"
            >
              <div>
                <p className="text-sm font-medium text-white">{f.name}</p>
                <p className="mt-0.5 text-xs text-secondary-blue-300">
                  {f.description}
                </p>
              </div>
              <Toggle on={!!enabled[f.key]} onChange={() => toggle(f.key)} />
            </div>
          ))}
        </section>
      </div>
    </StudioLayout>
  );
}
