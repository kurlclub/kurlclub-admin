'use client';

import { Badge } from '@kurlclub/ui-components';
import { AlertTriangle } from 'lucide-react';

import { ChartPlaceholder } from '@/components/shared/dashboard-primitives';
import { StudioLayout } from '@/components/shared/layout';

const SERVICES = [
  { key: 'api', name: 'API' },
  { key: 'web', name: 'Web Application' },
  { key: 'biometric', name: 'Biometric Devices' },
  { key: 'whatsapp', name: 'WhatsApp Service' },
  { key: 'razorpay', name: 'Razorpay Integration' },
];

function ServiceCard({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <Badge variant="info">Unknown</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-secondary-blue-300">Last sync</span>
        <span className="text-secondary-blue-100">—</span>
      </div>
    </div>
  );
}

export function HealthPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">System Health</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Live status of core services, uptime, and failure alerts
          </p>
        </div>

        {/* Service status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.key} name={s.name} />
          ))}
        </div>

        {/* Uptime */}
        <ChartPlaceholder
          title="Uptime Monitoring"
          description="Service uptime over time"
        />

        {/* Failure alerts */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-secondary-blue-300" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Failure Alerts &amp; Notifications
            </h2>
          </div>
          <p className="py-8 text-center text-sm text-secondary-blue-300">
            No alerts — failures will appear here once the backend is connected.
          </p>
        </section>
      </div>
    </StudioLayout>
  );
}
