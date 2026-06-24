'use client';

import { useMemo, useState } from 'react';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Sheet,
  useAppDialog,
} from '@kurlclub/ui-components';
import { UserCog } from 'lucide-react';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { demoUsers } from '@/lib/demo-data';

import { type AdminUserRow, createUsersColumns } from '../table/users-columns';

const inputClass =
  'w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-700 px-3 py-2 text-sm text-white outline-none focus:border-primary-green-500';

const STUB = 'Will be enabled once the backend is connected';

const ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

const SAMPLE_USER: AdminUserRow = {
  id: 0,
  name: 'Sample User',
  email: 'user@example.com',
  role: 'admin',
  status: 'active',
  lastLoginAt: null,
};

type SheetKind = 'set-password' | 'change-role' | null;

export function UsersListPage() {
  const { showConfirm } = useAppDialog();

  // Prototype demo data.
  const data: AdminUserRow[] = demoUsers;

  const [sheet, setSheet] = useState<SheetKind>(null);
  const [activeUser, setActiveUser] = useState<AdminUserRow>(SAMPLE_USER);

  const openSetPassword = (user: AdminUserRow) => {
    setActiveUser(user);
    setSheet('set-password');
  };
  const openChangeRole = (user: AdminUserRow) => {
    setActiveUser(user);
    setSheet('change-role');
  };
  const forceReset = (user: AdminUserRow) =>
    showConfirm({
      title: 'Force Password Reset',
      description: `Send a password-reset link to ${user.name}? They'll be required to set a new password.`,
      confirmLabel: 'Send Reset',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        toast.info(STUB);
      },
    });
  const unlock = (user: AdminUserRow) =>
    showConfirm({
      title: 'Unlock Account',
      description: `Unlock ${user.name}'s account and restore access?`,
      confirmLabel: 'Unlock',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        toast.info(STUB);
      },
    });

  const columns = useMemo(
    () =>
      createUsersColumns({
        onSetPassword: openSetPassword,
        onForceReset: forceReset,
        onUnlock: unlock,
        onChangeRole: openChangeRole,
      }),
    // handlers are stable enough for a shell
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const submitStub = () => {
    toast.info(STUB);
    setSheet(null);
  };

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Users</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Manage admin users — passwords, recovery, and roles
            </p>
          </div>

          {data.length > 0 ? (
            <DataTable
              columns={columns}
              data={data}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  searchPlaceholder="Search users..."
                />
              )}
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 py-16 text-center">
              <UserCog className="h-8 w-8 text-secondary-blue-300" />
              <div>
                <p className="text-sm font-medium text-white">No users yet</p>
                <p className="mt-1 text-sm text-secondary-blue-300">
                  Users will appear here once the backend is connected.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSetPassword(SAMPLE_USER)}
                >
                  Update Password
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => forceReset(SAMPLE_USER)}
                >
                  Force Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => unlock(SAMPLE_USER)}
                >
                  Unlock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openChangeRole(SAMPLE_USER)}
                >
                  Change Role
                </Button>
              </div>
            </div>
          )}
        </div>
      </StudioLayout>

      {/* Update Password */}
      <Sheet
        isOpen={sheet === 'set-password'}
        onClose={() => setSheet(null)}
        title="Update Password"
        description={`Set a new password for ${activeUser.name}`}
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSheet(null)}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Update Password</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">
              New Password
            </span>
            <input type="password" className={inputClass} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm text-secondary-blue-200">
              Confirm Password
            </span>
            <input type="password" className={inputClass} />
          </label>
        </div>
      </Sheet>

      {/* Change Role */}
      <Sheet
        isOpen={sheet === 'change-role'}
        onClose={() => setSheet(null)}
        title="Change Role"
        description={`Update the role for ${activeUser.name}`}
        width="md"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSheet(null)}>
              Cancel
            </Button>
            <Button onClick={submitStub}>Save Role</Button>
          </div>
        }
      >
        <label className="block space-y-1.5">
          <span className="text-sm text-secondary-blue-200">Role</span>
          <select className={inputClass} defaultValue={activeUser.role}>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </Sheet>
    </>
  );
}
