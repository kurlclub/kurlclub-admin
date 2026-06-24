'use client';

import { Button } from '@kurlclub/ui-components';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';

import { AudienceFields } from './audience-fields';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

export function PushNotificationsPage() {
  const handleSend = () => {
    toast.info('Will be enabled once the backend is connected');
  };

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Push Notifications</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Send a push notification to your users
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Composer */}
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6 lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Compose
            </h2>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">Title</span>
                <input className={inputClass} placeholder="Notification title" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">Message</span>
                <textarea
                  className={inputClass}
                  rows={4}
                  placeholder="What do you want to say?"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm text-secondary-blue-200">
                  Deep link (optional)
                </span>
                <input className={inputClass} placeholder="kurlclub://..." />
              </label>
              <AudienceFields />
              <div className="flex justify-end">
                <Button onClick={handleSend} className="gap-2">
                  <Bell className="h-4 w-4" />
                  Send Notification
                </Button>
              </div>
            </div>
          </section>

          {/* Recent */}
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Recently Sent
            </h2>
            <p className="py-10 text-center text-sm text-secondary-blue-300">
              Sent notifications will appear here.
            </p>
          </section>
        </div>
      </div>
    </StudioLayout>
  );
}
