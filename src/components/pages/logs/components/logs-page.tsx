'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { BarChartMini } from '@/components/shared/mini-chart';
import { demoLogs, demoPerfTrend } from '@/lib/demo-data';

const TABS = [
  { key: 'admin', label: 'Admin Activity' },
  { key: 'user', label: 'User Activity' },
  { key: 'api', label: 'API & Error Logs' },
  { key: 'audit', label: 'Audit Trail' },
  { key: 'login', label: 'Login History' },
  { key: 'usage', label: 'System Usage' },
];

const fmtTime = (iso: string) => new Date(iso).toLocaleString();

export function LogsPage() {
  const [tab, setTab] = useState('admin');
  const rows = demoLogs[tab] ?? [];

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Logs & Analytics</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Activity, audit, and system usage logs
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              toast.info('Will be enabled once the backend is connected')
            }
          >
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                tab === t.key
                  ? 'border-primary-green-500 bg-primary-green-500/15 text-primary-green-500'
                  : 'border-secondary-blue-400 text-secondary-blue-200 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Active log table */}
        <div className="overflow-x-auto rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-blue-400 text-left text-xs uppercase tracking-wide text-secondary-blue-300">
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-secondary-blue-400/50 last:border-0"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-secondary-blue-100">
                    {fmtTime(r.time)}
                  </td>
                  <td className="px-5 py-3 text-white">{r.actor}</td>
                  <td className="px-5 py-3 text-secondary-blue-100">
                    {r.action}
                  </td>
                  <td className="px-5 py-3 text-secondary-blue-100">
                    {r.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance metrics */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Performance Metrics
          </h2>
          <p className="mb-4 text-xs text-secondary-blue-300">
            Average API latency (ms) over time
          </p>
          <BarChartMini data={demoPerfTrend} height={140} />
        </section>
      </div>
    </StudioLayout>
  );
}
