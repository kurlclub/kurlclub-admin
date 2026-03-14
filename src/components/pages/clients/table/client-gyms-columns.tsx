import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Trash2 } from 'lucide-react';

import type { ClientGymSummary } from '@/types/client';

type ClientGymActions = {
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export const createClientGymsColumns = ({
  onView,
  onEdit,
  onDelete,
}: ClientGymActions) =>
  [
    {
      accessorKey: 'gymName',
      header: 'Gym Name',
      cell: ({ row }) => (
        <span className="text-white">{row.original.gymName}</span>
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
      accessorKey: 'contactNumber1',
      header: 'Contact',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.contactNumber1 || '—'}
        </span>
      ),
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
  ] satisfies ColumnDef<ClientGymSummary>[];
