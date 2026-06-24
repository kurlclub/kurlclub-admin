'use client';

import { StatTile } from '@/components/shared/dashboard-primitives';
import { StudioLayout } from '@/components/shared/layout';
import { BarChartMini, HBarList } from '@/components/shared/mini-chart';
import {
  demoPlanMix,
  demoRevenueKpis,
  demoRevenueTrend,
  demoTopClients,
  demoTopGyms,
} from '@/lib/demo-data';

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
          <StatTile
            label="MRR"
            value={demoRevenueKpis.mrr}
            hint="▲ 6.1% vs last month"
          />
          <StatTile
            label="ARR"
            value={demoRevenueKpis.arr}
            hint="▲ 7.2% vs last month"
          />
          <StatTile
            label="Active Subscriptions"
            value={demoRevenueKpis.activeSubscriptions}
            hint="▲ 2.4% vs last month"
          />
          <StatTile
            label="Trial → Paid"
            value={demoRevenueKpis.trialToPaid}
            hint="312 active"
          />
        </div>

        {/* Revenue + plan mix */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6 lg:col-span-2">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Revenue Trend
            </h2>
            <p className="mb-4 text-xs text-secondary-blue-300">
              MRR over the last 12 months
            </p>
            <BarChartMini data={demoRevenueTrend} />
          </section>
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Plan Mix
            </h2>
            <HBarList
              items={demoPlanMix.map((p) => ({
                label: p.plan,
                value: p.pct,
                display: `${p.pct}%`,
              }))}
            />
          </section>
        </div>

        {/* Top performers */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Top Performing Gyms
            </h2>
            <HBarList
              items={demoTopGyms.map((g) => ({
                label: g.name,
                value: g.value,
                display: `${g.value} members`,
              }))}
            />
          </section>
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Top Performing Clients
            </h2>
            <HBarList
              items={demoTopClients.map((c) => ({
                label: c.name,
                value: c.value,
                display: `${c.value} gyms`,
              }))}
            />
          </section>
        </div>
      </div>
    </StudioLayout>
  );
}
