import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

/** UI-only row shape for the subscriptions list (no backend yet). */
export type ClientSubscriptionRow = {
  id: number;
  clientName: string;
  planName: string;
  status: string;
  amount: number;
  billingCycle: string;
  renewsOn: string | null;
};

export const formatInr = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : '—';

export const createSubscriptionsColumns = ({
  onView,
}: {
  onView: (id: number) => void;
}) =>
  [
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <span className="text-white">{row.original.clientName}</span>
      ),
    },
    {
      accessorKey: 'planName',
      header: 'Plan',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">{row.original.planName}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="info">{row.original.status || '—'}</Badge>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {formatInr(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: 'renewsOn',
      header: 'Renews / Ends',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {formatDate(row.original.renewsOn)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(row.original.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ] satisfies ColumnDef<ClientSubscriptionRow>[];
