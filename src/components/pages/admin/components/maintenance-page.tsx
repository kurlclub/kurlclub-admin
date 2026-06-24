'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const DEFAULT_MESSAGE =
  'KurlClub is undergoing scheduled maintenance. We will be back shortly.';

export function MaintenancePage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Announcement &amp; Maintenance Mode
          </h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Put the platform into maintenance and set the banner message
          </p>
        </div>

        {enabled && (
          <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Preview — banner is live</p>
              <p className="mt-0.5 text-sm">{message || 'No message set.'}</p>
            </div>
          </div>
        )}

        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <div className="space-y-5">
            <label className="flex items-center justify-between gap-4">
              <span className="text-sm text-white">
                Enable maintenance mode
                <span className="mt-0.5 block text-xs text-secondary-blue-300">
                  Users will see the banner and be blocked from the app
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={() => setEnabled((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition ${
                  enabled
                    ? 'border-primary-green-500 bg-primary-green-500/30'
                    : 'border-secondary-blue-400 bg-secondary-blue-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full transition ${
                    enabled
                      ? 'translate-x-6 bg-primary-green-500'
                      : 'translate-x-1 bg-secondary-blue-200'
                  }`}
                />
              </button>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm text-secondary-blue-200">
                Banner Message
              </span>
              <textarea
                className={inputClass}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <div className="flex justify-end">
              <Button
                onClick={() =>
                  toast.info('Will be enabled once the backend is connected')
                }
              >
                Save Settings
              </Button>
            </div>
          </div>
        </section>
      </div>
    </StudioLayout>
  );
}
