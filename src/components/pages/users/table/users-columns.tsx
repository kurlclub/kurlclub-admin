import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import {
  KeyRound,
  Lock,
  MoreHorizontal,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

/** UI-only row shape for the users list (no backend yet). */
export type AdminUserRow = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLoginAt: string | null;
};

export type UserActions = {
  onSetPassword: (user: AdminUserRow) => void;
  onForceReset: (user: AdminUserRow) => void;
  onUnlock: (user: AdminUserRow) => void;
  onChangeRole: (user: AdminUserRow) => void;
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString() : 'Never';

export const createUsersColumns = (actions: UserActions) =>
  [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-white">{row.original.name}</span>
          <span className="text-xs text-secondary-blue-300">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="capitalize text-secondary-blue-100">
          {row.original.role.replace('_', ' ')}
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
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => actions.onSetPassword(row.original)}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Update Password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => actions.onForceReset(row.original)}
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Force Password Reset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onUnlock(row.original)}>
                <Lock className="mr-2 h-4 w-4" /> Unlock Account
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => actions.onChangeRole(row.original)}
              >
                <ShieldCheck className="mr-2 h-4 w-4" /> Change Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ] satisfies ColumnDef<AdminUserRow>[];
