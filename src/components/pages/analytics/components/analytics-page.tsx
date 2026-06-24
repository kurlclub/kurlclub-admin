'use client';

import { StudioLayout } from '@/components/shared/layout';
import { StatTile } from '@/components/shared/dashboard-primitives';
import { BarChartMini, HBarList } from '@/components/shared/mini-chart';
import {
  demoAnalyticsKpis,
  demoChurnTrend,
  demoConversionFunnel,
  demoTrialConversionTrend,
} from '@/lib/demo-data';

export function AnalyticsPage() {
  return (
    <StudioLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-secondary-blue-200">
            Conversion, churn, and trial-to-paid performance
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatTile label="Conversion Rate" value={demoAnalyticsKpis.conversion} />
          <StatTile label="Churn Rate" value={demoAnalyticsKpis.churn} />
          <StatTile label="Trial → Paid Rate" value={demoAnalyticsKpis.trialToPaid} />
        </div>

        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
            Subscription Conversion
          </h2>
          <HBarList
            items={demoConversionFunnel.map((s) => ({
              label: s.stage,
              value: s.value,
              display: s.value.toLocaleString('en-IN'),
            }))}
          />
        </section>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Churn Analysis
            </h2>
            <p className="mb-4 text-xs text-secondary-blue-300">Monthly churn %</p>
            <BarChartMini data={demoChurnTrend} color="#f04c5b" height={140} />
          </section>
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
              Trial-to-Paid Conversion
            </h2>
            <HBarList
              items={demoTrialConversionTrend.map((t) => ({
                label: t.month,
                value: t.converted,
                display: `${t.converted}/${t.trials}`,
              }))}
            />
          </section>
        </div>
      </div>
    </StudioLayout>
  );
}
