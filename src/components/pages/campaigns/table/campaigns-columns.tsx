import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';

/** UI-only row shape for the campaigns list (no backend yet). */
export type CampaignRow = {
  id: number;
  name: string;
  channel: string;
  status: string;
  audience: string;
  sent: number;
  opened: number;
  scheduledFor: string | null;
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : '—';

export const createCampaignsColumns = ({
  onView,
}: {
  onView: (id: number) => void;
}) =>
  [
    {
      accessorKey: 'name',
      header: 'Campaign',
      cell: ({ row }) => (
        <span className="text-white">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100 capitalize">
          {row.original.channel}
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
      accessorKey: 'audience',
      header: 'Audience',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">{row.original.audience}</span>
      ),
    },
    {
      accessorKey: 'sent',
      header: 'Sent / Opened',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.sent} / {row.original.opened}
        </span>
      ),
    },
    {
      accessorKey: 'scheduledFor',
      header: 'Scheduled',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {formatDate(row.original.scheduledFor)}
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
  ] satisfies ColumnDef<CampaignRow>[];
