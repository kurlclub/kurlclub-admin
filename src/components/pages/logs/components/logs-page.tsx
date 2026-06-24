'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { Download, ScrollText } from 'lucide-react';
import { toast } from 'sonner';

import { ChartPlaceholder } from '@/components/shared/dashboard-primitives';
import { StudioLayout } from '@/components/shared/layout';

const TABS = [
  { key: 'admin', label: 'Admin Activity' },
  { key: 'user', label: 'User Activity' },
  { key: 'api', label: 'API & Error Logs' },
  { key: 'audit', label: 'Audit Trail' },
  { key: 'login', label: 'Login History' },
  { key: 'usage', label: 'System Usage' },
];

export function LogsPage() {
  const [tab, setTab] = useState('admin');
  const activeLabel = TABS.find((t) => t.key === tab)?.label ?? '';

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

        {/* Active log table shell */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
          <ScrollText className="h-8 w-8 text-secondary-blue-300" />
          <div>
            <p className="text-sm font-medium text-white">
              No {activeLabel.toLowerCase()} yet
            </p>
            <p className="mt-1 text-sm text-secondary-blue-300">
              Logs will appear here once the backend is connected.
            </p>
          </div>
        </div>

        {/* Performance metrics */}
        <ChartPlaceholder
          title="Performance Metrics"
          description="Latency, error rate, and throughput over time"
        />
      </div>
    </StudioLayout>
  );
}
