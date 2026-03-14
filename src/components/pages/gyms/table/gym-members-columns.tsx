import { Badge, Button } from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';

import type { GymMember } from '@/types/member';

type MemberColumnOptions = {
  onView?: (identifier: string) => void;
};

export const createGymMembersColumns = ({
  onView,
}: MemberColumnOptions = {}) => {
  const columns: ColumnDef<GymMember>[] = [
    {
      accessorKey: 'memberName',
      header: 'Member Name',
      cell: ({ row }) => (
        <span className="text-white">{row.original.memberName}</span>
      ),
    },
    {
      accessorKey: 'memberIdentifier',
      header: 'Identifier',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">
          {row.original.memberIdentifier}
        </span>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">{row.original.phone}</span>
      ),
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">{row.original.gender}</span>
      ),
    },
    {
      accessorKey: 'package',
      header: 'Package',
      cell: ({ row }) => (
        <span className="text-secondary-blue-100">{row.original.package}</span>
      ),
    },
    {
      accessorKey: 'feeStatus',
      header: 'Fee Status',
      cell: ({ row }) => <Badge variant="info">{row.original.feeStatus}</Badge>,
    },
  ];

  if (onView) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(row.original.memberIdentifier)}
          >
            View
          </Button>
        </div>
      ),
    });
  }

  return columns;
};
