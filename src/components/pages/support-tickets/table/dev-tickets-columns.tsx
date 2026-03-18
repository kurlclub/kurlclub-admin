import { Badge, Button, InfoBadge } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Code,
  Eye,
  Lock,
} from 'lucide-react';

import {
  formatTicketDate,
  getPriorityBadgeClasses,
  getTicketStatusVariant,
} from '@/lib/utils/ticket.utils';
import type { Ticket, TicketStatus } from '@/types/ticket';

const multiSelectFilter = (
  row: { getValue: (id: string) => unknown },
  columnId: string,
  filterValue: string[],
) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
  return filterValue.includes(String(row.getValue(columnId)));
};

const getStatusIcon = (status: TicketStatus) => {
  switch (status) {
    case 'Resolved':
      return <CheckCircle2 className="h-3.5 w-3.5" />;
    case 'In Progress':
      return <Clock className="h-3.5 w-3.5" />;
    case 'Closed':
      return <Lock className="h-3.5 w-3.5" />;
    case 'Code Review':
      return <Code className="h-3.5 w-3.5" />;
    case 'Open':
    default:
      return <AlertTriangle className="h-3.5 w-3.5" />;
  }
};

export const createDevTicketsColumns = (
  onView: (id: number) => void,
): ColumnDef<Ticket>[] => [
  {
    accessorKey: 'ticketId',
    header: 'Ticket ID',
    cell: ({ row }) => (
      <span className="font-mono text-sm text-white">
        {row.original.ticketId}
      </span>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <span className="text-sm text-secondary-blue-100">
        {row.original.subject}
      </span>
    ),
  },
  {
    accessorKey: 'client',
    header: 'Client',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">{row.original.client}</span>
    ),
  },
  {
    accessorKey: 'assignedDev',
    header: 'Assigned Dev',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {row.original.assignedDev || 'Unassigned'}
      </span>
    ),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    filterFn: multiSelectFilter,
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={`border text-[11px] uppercase tracking-wide ${getPriorityBadgeClasses(row.original.priority)} ${row.original.priority === 'Critical' ? 'animate-pulse' : ''}`}
      >
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: multiSelectFilter,
    cell: ({ row }) => (
      <InfoBadge
        variant={getTicketStatusVariant(row.original.status)}
        showIcon={false}
      >
        <span className="inline-flex items-center gap-1.5 text-xs">
          {getStatusIcon(row.original.status)}
          {row.original.status}
        </span>
      </InfoBadge>
    ),
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {row.original.branch || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'estimatedHours',
    header: 'Est. Hours',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {typeof row.original.estimatedHours === 'number'
          ? row.original.estimatedHours
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'devNotes',
    header: 'Dev Notes',
    cell: ({ row }) => (
      <span className="text-secondary-blue-200 line-clamp-2">
        {row.original.devNotes || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {formatTicketDate(row.original.createdAt)}
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
          className="gap-2 transition-transform hover:scale-[0.98]"
          onClick={() => onView(row.original.id)}
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </div>
    ),
  },
];
