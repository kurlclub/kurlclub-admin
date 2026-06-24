'use client';

import { useRouter } from 'next/navigation';

import { Badge, Button } from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';

const STATS = ['Sent', 'Delivered', 'Opened', 'Clicked', 'Failed'];

const StatTile = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-4">
    <p className="text-xs uppercase tracking-wide text-secondary-blue-300">
      {label}
    </p>
    <p className="mt-1 text-2xl font-bold text-white">—</p>
  </div>
);

const DetailField = ({ label }: { label: string }) => (
  <div>
    <p className="text-xs text-secondary-blue-300">{label}</p>
    <p className="mt-0.5 text-sm text-white">—</p>
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
                <h1 className="text-2xl font-bold text-white">Campaign</h1>
                <Badge variant="info">—</Badge>
              </div>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Campaign performance and delivery
              </p>
            </div>
          </div>
        </div>

        {/* Performance tiles */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s) => (
            <StatTile key={s} label={s} />
          ))}
        </div>

        {/* Overview */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            <DetailField label="Channel" />
            <DetailField label="Audience" />
            <DetailField label="Status" />
            <DetailField label="Scheduled For" />
            <DetailField label="Sent At" />
            <DetailField label="Created" />
          </div>
        </section>

        {/* Performance over time */}
        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Performance Over Time
          </h2>
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-secondary-blue-400 text-sm text-secondary-blue-300">
            Performance chart will appear here once the backend is connected.
          </div>
        </section>
      </div>
    </StudioLayout>
  );
}
