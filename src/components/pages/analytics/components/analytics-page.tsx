'use client';

import { StudioLayout } from '@/components/shared/layout';
import {
  ChartPlaceholder,
  StatTile,
} from '@/components/shared/dashboard-primitives';

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
          <StatTile label="Conversion Rate" />
          <StatTile label="Churn Rate" />
          <StatTile label="Trial → Paid Rate" />
        </div>

        <ChartPlaceholder
          title="Subscription Conversion"
          description="Funnel from sign-up to paid"
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartPlaceholder
            title="Churn Analysis"
            description="Cancellations over time"
          />
          <ChartPlaceholder
            title="Trial-to-Paid Conversion"
            description="Trials vs. converted by month"
          />
        </div>
      </div>
    </StudioLayout>
  );
}
