import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

import type { Gym } from '@/types/gym';

type GymRow = Gym & { clientName?: string };

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : '—';

type GymActions = {
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const createGymsColumns = ({ onView, onEdit, onDelete }: GymActions) =>
  [
    {
      accessorKey: 'gymName',
      header: 'Gym Name',
      cell: ({ row }) => (
        <span className="text-white">{row.original.gymName}</span>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.clientName || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.location || '—'}
        </span>
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
      accessorKey: 'gymIdentifier',
      header: 'Identifier',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.gymIdentifier || '—'}
        </span>
      ),
    },
    {
      accessorKey: 'memberCount',
      header: 'Members',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.memberCount ?? '—'}
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
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(row.original.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(row.original.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ] satisfies ColumnDef<GymRow>[];

export type { GymRow };
