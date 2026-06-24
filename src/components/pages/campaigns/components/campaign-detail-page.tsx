'use client';

import { useRouter } from 'next/navigation';

import { Badge, Button } from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { BarChartMini } from '@/components/shared/mini-chart';
import { demoCampaignDetail as c } from '@/lib/demo-data';

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString() : '—';

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-4">
    <p className="text-xs uppercase tracking-wide text-secondary-blue-300">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold text-white">{value}</p>
  </div>
);

const DetailField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-secondary-blue-300">{label}</p>
    <p className="mt-0.5 text-sm text-white">{value}</p>
  </div>
);

export function CampaignDetailPage() {
  const router = useRouter();

  return (
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
                <h1 className="text-2xl font-bold text-white">{c.name}</h1>
                <Badge variant="info">{c.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-secondary-blue-200">
                {c.channel} · {c.audience}
              </p>
            </div>
          </div>
        </div>

        {/* Performance tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(c.stats).map(([label, value]) => (
            <StatTile key={label} label={label} value={value} />
          ))}
        </div>

        {/* Overview */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <DetailField label="Channel" value={c.channel} />
            <DetailField label="Audience" value={c.audience} />
            <DetailField label="Status" value={c.status} />
            <DetailField label="Scheduled For" value={fmtDate(c.scheduledFor)} />
            <DetailField label="Sent At" value={fmtDate(c.sentAt)} />
            <DetailField label="Created" value={fmtDate(c.created)} />
          </div>
        </section>

        {/* Performance over time */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Performance Over Time
          </h2>
          <p className="mb-4 text-xs text-secondary-blue-300">Opens by day</p>
          <BarChartMini data={c.daily} height={160} />
        </section>
      </div>
    </StudioLayout>
  );
}
