'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
} from '@kurlclub/ui-components';
import { Sheet } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import {
  type GymRow,
  createGymsColumns,
} from '@/components/pages/gyms/table/gyms-columns';
import { StudioLayout } from '@/components/shared/layout';
import { resolveClientId } from '@/lib/client-utils';
import { useClients } from '@/services/clients';
import {
  useCreateGym,
  useDeleteGym,
  useGym,
  useGyms,
  useUpdateGym,
} from '@/services/gyms';
import type { GymFormData } from '@/types/gym';

import { GymForm } from './gym-form';

const filterGyms = (gyms: GymRow[], term: string) => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return gyms;
  return gyms.filter((gym) => {
    const haystack = [
      gym.gymName,
      gym.location,
      gym.status,
      gym.gymIdentifier,
      gym.clientName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export function GymListPage() {
  const router = useRouter();
  const { data: gyms, isLoading } = useGyms();
  const { data: clients } = useClients();

  const createMutation = useCreateGym();
  const updateMutation = useUpdateGym();
  const deleteMutation = useDeleteGym();

  const [editId, setEditId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: gymDetail, isLoading: isGymLoading } = useGym(
    editId ?? Number.NaN,
  );

  const clientMap = useMemo(() => {
    const map = new Map<number, string>();
    clients?.forEach((client) => {
      const clientId = resolveClientId(client);
      if (!clientId) return;
      map.set(clientId, client.userName || client.email || `#${clientId}`);
    });
    return map;
  }, [clients]);

  const gymRows = useMemo<GymRow[]>(() => {
    return (gyms ?? []).map((gym) => ({
      ...gym,
      clientName:
        clientMap.get(gym.gymAdminId) ?? String(gym.gymAdminId ?? '—'),
    }));
  }, [gyms, clientMap]);

  const filteredGyms = useMemo(
    () => filterGyms(gymRows, searchTerm),
    [gymRows, searchTerm],
  );

  const handleCreate = async (data: GymFormData) => {
    await createMutation.mutateAsync(data);
    setIsCreating(false);
  };

  const handleUpdate = async (data: GymFormData) => {
    if (!editId) return;
    await updateMutation.mutateAsync({ id: editId, data });
    setEditId(null);
  };

  const handleDelete = useCallback(
    async (id: number) => {
      if (confirm('Are you sure you want to delete this gym?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const columns = useMemo(
    () =>
      createGymsColumns({
        onView: (id) => router.push(`/gyms/${id}`),
        onEdit: (id) => setEditId(id),
        onDelete: handleDelete,
      }),
    [handleDelete, router],
  );

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Gyms</h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                Manage client gym locations and assignments
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Gym
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : filteredGyms.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredGyms}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  onSearch={setSearchTerm}
                  searchPlaceholder="Search gyms..."
                />
              )}
            />
          ) : (
            <div className="text-center py-20 text-secondary-blue-300">
              No gyms found.
            </div>
          )}
        </div>
      </StudioLayout>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create Gym"
        description="Add a new gym location"
        width="xl"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="gym-create-form"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Gym'}
            </Button>
          </div>
        }
      >
        <GymForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
          isLoading={createMutation.isPending}
          formId="gym-create-form"
          showActions={false}
        />
      </Sheet>

      <Sheet
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Gym"
        description="Update gym details"
        width="xl"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditId(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="gym-edit-form"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        {editId && isGymLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : gymDetail ? (
          <GymForm
            defaultValues={gymDetail}
            onSubmit={handleUpdate}
            onCancel={() => setEditId(null)}
            isLoading={updateMutation.isPending}
            formId="gym-edit-form"
            showActions={false}
          />
        ) : (
          <div className="text-center py-10 text-secondary-blue-300">
            Unable to load gym details.
          </div>
        )}
      </Sheet>
    </>
  );
}
