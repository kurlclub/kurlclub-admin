'use client';

import {
  ChartPlaceholder,
  StatTile,
} from '@/components/shared/dashboard-primitives';
import { StudioLayout } from '@/components/shared/layout';

const EMPTY = (
  <p className="py-10 text-center text-sm text-secondary-blue-300">
    No data yet — connects once the backend is available.
  </p>
);

export function DashboardPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Dashboard</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Recurring revenue, plan mix, and top performers
          </p>
        </div>

        {/* MRR / ARR tracking */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="MRR" />
          <StatTile label="ARR" />
          <StatTile label="Active Subscriptions" />
          <StatTile label="Trial → Paid" />
        </div>

        {/* Revenue + plan mix */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ChartPlaceholder
            title="Revenue Trend"
            description="MRR / ARR over time"
            className="lg:col-span-2"
          />
          <ChartPlaceholder title="Plan Mix" description="Revenue by plan" />
        </div>

        {/* Top performers */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Top Performing Gyms
            </h2>
            {EMPTY}
          </section>
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Top Performing Clients
            </h2>
            {EMPTY}
          </section>
        </div>
      </div>
    </StudioLayout>
  );
}
