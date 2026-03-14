import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

import { resolveClientId } from '@/lib/client-utils';
import type { Client } from '@/types/client';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : '—';

export const createClientsColumns = (onView: (id: number) => void) =>
  [
    {
      accessorKey: 'userName',
      header: 'Client',
      cell: ({ row }) => {
        const client = row.original;
        const clientId = resolveClientId(client);
        return (
          <div className="flex flex-col">
            <span className="font-medium text-white">{client.userName}</span>
            <span className="text-xs text-secondary-blue-300">
              {clientId ? `ID #${clientId}` : 'ID —'}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.email || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.phoneNumber || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'subscriptionPlanName',
      header: 'Subscription Plan',
      cell: ({ row }) =>
        row.original.subscriptionPlanName ? (
          <Badge variant="info">{row.original.subscriptionPlanName}</Badge>
        ) : (
          <span className="text-secondary-blue-300">—</span>
        ),
    },
    {
      id: 'gymsCount',
      header: 'Gyms Count',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.gyms?.length ?? row.original.gymsCount ?? 0}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'lastLoginAt',
      header: 'Last Login',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {formatDate(row.original.lastLoginAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const clientId = resolveClientId(row.original);
        return (
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => {
                if (clientId) {
                  onView(clientId);
                }
              }}
              disabled={!clientId}
            >
              <Eye className="h-4 w-4" />
              View Client
            </Button>
          </div>
        );
      },
    },
  ] satisfies ColumnDef<Client>[];
