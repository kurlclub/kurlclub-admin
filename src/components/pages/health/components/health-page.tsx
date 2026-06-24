'use client';

import { AlertTriangle } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { BarChartMini } from '@/components/shared/mini-chart';
import {
  demoHealthAlerts,
  demoHealthServices,
  demoUptimeTrend,
} from '@/lib/demo-data';

const TONE_TEXT: Record<string, string> = {
  ok: 'text-primary-green-500',
  warn: 'text-amber-400',
  down: 'text-[#f04c5b]',
};
const TONE_DOT: Record<string, string> = {
  ok: 'bg-primary-green-500',
  warn: 'bg-amber-400',
  down: 'bg-[#f04c5b]',
};

function ServiceCard({
  service,
}: {
  service: (typeof demoHealthServices)[number];
}) {
  const { name, status, tone, lastSync, latency, uptime } = service;
  return (
    <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium ${TONE_TEXT[tone]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`} />
          {status}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div>
          <dt className="text-xs text-secondary-blue-300">Latency</dt>
          <dd className="text-white">{latency}</dd>
        </div>
        <div>
          <dt className="text-xs text-secondary-blue-300">Uptime</dt>
          <dd className="text-white">{uptime}</dd>
        </div>
        <div>
          <dt className="text-xs text-secondary-blue-300">Last sync</dt>
          <dd className="text-white">{lastSync}</dd>
        </div>
      </dl>
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
          {demoHealthServices.map((s) => (
            <ServiceCard key={s.key} service={s} />
          ))}
        </div>

        {/* Uptime */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Uptime Monitoring
          </h2>
          <p className="mb-4 text-xs text-secondary-blue-300">
            Uptime % over the last 12 periods
          </p>
          <BarChartMini data={demoUptimeTrend} height={140} />
        </section>

        {/* Failure alerts */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-secondary-blue-300" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Failure Alerts &amp; Notifications
            </h2>
          </div>
          <ul className="divide-y divide-secondary-blue-400/60">
            {demoHealthAlerts.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="text-sm text-white">
                    <span
                      className={
                        a.level === 'Critical'
                          ? 'text-[#f04c5b]'
                          : 'text-amber-400'
                      }
                    >
                      {a.level}
                    </span>{' '}
                    · {a.service}
                  </p>
                  <p className="mt-0.5 text-sm text-secondary-blue-200">
                    {a.message}
                  </p>
                </div>
                <span className="text-xs text-secondary-blue-300">{a.at}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StudioLayout>
  );
}
