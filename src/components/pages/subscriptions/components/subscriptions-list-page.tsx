'use client';

import { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { Button, DataTable, DataTableToolbar } from '@kurlclub/ui-components';
import { CreditCard } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { demoSubscriptions } from '@/lib/demo-data';

import {
  type ClientSubscriptionRow,
  createSubscriptionsColumns,
} from '../table/subscriptions-columns';

export function SubscriptionsListPage() {
  const router = useRouter();

  // Prototype demo data.
  const data: ClientSubscriptionRow[] = demoSubscriptions;

  const columns = useMemo(
    () =>
      createSubscriptionsColumns({
        onView: (id) => router.push(`/subscriptions/${id}`),
      }),
    [router],
  );

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Client Subscriptions
            </h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Manage client subscriptions — upgrade, renew, extend trials, and
              cancel
            </p>
          </div>
        </div>

        {data.length > 0 ? (
          <DataTable
            columns={columns}
            data={data}
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                searchPlaceholder="Search subscriptions..."
              />
            )}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
            <CreditCard className="h-8 w-8 text-secondary-blue-300" />
            <div>
              <p className="text-sm font-medium text-white">
                No client subscriptions yet
              </p>
              <p className="mt-1 text-sm text-secondary-blue-300">
                Subscriptions will appear here once the backend is connected.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/subscriptions/1')}
            >
              Preview subscription management
            </Button>
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
