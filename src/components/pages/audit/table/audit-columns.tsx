import type { ColumnDef } from '@tanstack/react-table';

/** UI-only row shape for the audit log (no backend yet). */
export type AuditRow = {
  id: number;
  createdAt: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : '—';

export const auditColumns = [
  {
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: 'actor',
    header: 'Actor',
    cell: ({ row }) => <span className="text-white">{row.original.actor}</span>,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">{row.original.action}</span>
    ),
  },
  {
    accessorKey: 'target',
    header: 'Target',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">{row.original.target || '—'}</span>
    ),
  },
  {
    accessorKey: 'ip',
    header: 'IP',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">{row.original.ip || '—'}</span>
    ),
  },
] satisfies ColumnDef<AuditRow>[];
