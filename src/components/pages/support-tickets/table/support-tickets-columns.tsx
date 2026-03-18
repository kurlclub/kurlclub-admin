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
  getPriorityAccentClasses,
  getPriorityBadgeClasses,
  getSlaStatusClasses,
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

export const createSupportTicketsColumns = (
  onView: (id: number) => void,
): ColumnDef<Ticket>[] => [
  {
    accessorKey: 'ticketId',
    header: 'Ticket ID',
    cell: ({ row }) => (
      <div className="relative pl-3">
        <span
          className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full ${getPriorityAccentClasses(row.original.priority)}`}
        />
        <span className="font-mono text-sm text-white">
          {row.original.ticketId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {row.original.requiresDeveloper && (
            <span className="inline-flex items-center gap-1 rounded-full border border-secondary-blue-400/60 bg-secondary-blue-600/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-blue-200">
              <Code className="h-3 w-3" />
              Dev
            </span>
          )}
          <span
            className={`text-sm ${row.original.status === 'Open' ? 'font-semibold text-white' : 'text-secondary-blue-100'}`}
          >
            {row.original.subject}
          </span>
        </div>
        <span className="text-xs text-secondary-blue-300">
          {row.original.description}
        </span>
      </div>
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
    accessorKey: 'assignedTo',
    header: 'Assigned To',
    cell: ({ row }) => (
      <span className="text-secondary-blue-100">
        {row.original.assignedTo || 'Unassigned'}
      </span>
    ),
  },
  {
    accessorKey: 'slaStatus',
    header: 'SLA Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getSlaStatusClasses(row.original.slaStatus)}`}
      >
        {row.original.slaStatus}
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
