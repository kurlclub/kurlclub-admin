'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Badge,
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
} from '@kurlclub/ui-components';
import { Sheet } from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';

import { createClientGymsColumns } from '@/components/pages/clients/table/client-gyms-columns';
import { StudioLayout } from '@/components/shared/layout';
import { useClient } from '@/services/clients';
import { useDeleteGym, useGym, useUpdateGym } from '@/services/gyms';
import type { GymFormData } from '@/types/gym';

import { GymForm } from '../../gyms/components/gym-form';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : '—';

const getInitials = (name?: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

interface ClientDetailsPageProps {
  clientId: number | string;
}

export function ClientDetailsPage({ clientId }: ClientDetailsPageProps) {
  const router = useRouter();
  const resolvedClientId =
    typeof clientId === 'string' ? Number(clientId) : clientId;
  const isValidClientId =
    Number.isFinite(resolvedClientId) && resolvedClientId > 0;
  const { data: client, isLoading } = useClient(
    isValidClientId ? resolvedClientId : Number.NaN,
  );
  const [editGymId, setEditGymId] = useState<number | null>(null);
  const [gymSearch, setGymSearch] = useState('');

  const deleteGymMutation = useDeleteGym();
  const updateGymMutation = useUpdateGym();

  const { data: gymDetail, isLoading: isGymLoading } = useGym(
    editGymId ?? Number.NaN,
  );

  const gymOptions = useMemo(() => client?.gyms ?? [], [client?.gyms]);

  const filteredGyms = useMemo(() => {
    const normalized = gymSearch.trim().toLowerCase();
    if (!normalized) return gymOptions;
    return gymOptions.filter((gym) => {
      const haystack = [
        gym.gymName,
        gym.location,
        gym.email,
        gym.contactNumber1,
        gym.gymIdentifier,
        gym.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [gymOptions, gymSearch]);

  const handleDeleteGym = useCallback(
    async (gymId: number) => {
      if (confirm('Are you sure you want to delete this gym?')) {
        await deleteGymMutation.mutateAsync(gymId);
      }
    },
    [deleteGymMutation],
  );

  const handleUpdateGym = async (data: GymFormData) => {
    if (!editGymId) return;
    await updateGymMutation.mutateAsync({ id: editGymId, data });
    setEditGymId(null);
  };

  const gymColumns = useMemo(
    () =>
      createClientGymsColumns({
        onView: (id) => router.push(`/gyms/${id}`),
        onEdit: (id) => setEditGymId(id),
        onDelete: handleDeleteGym,
      }),
    [handleDeleteGym, router],
  );

  if (!isValidClientId) {
    return (
      <StudioLayout>
        <div className="text-center py-20 text-secondary-blue-300">
          Invalid client identifier.
        </div>
      </StudioLayout>
    );
  }

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Client Details</h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                View client profile, subscriptions, and gym locations
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/subscription-plans')}
            >
              View Plans
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/gyms')}
              className="gap-2"
            >
              Manage Client Gyms
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : client ? (
          <div className="space-y-6">
            {/* Client Profile */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
                Client Profile
              </h2>
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-secondary-blue-500 border border-secondary-blue-400 flex items-center justify-center text-xl font-semibold text-white">
                    {client.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={encodeURI(client.photoURL)}
                        alt={client.userName}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      getInitials(client.userName)
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {client.userName}
                    </h3>
                    <p className="text-sm text-secondary-blue-200">
                      {client.email}
                    </p>
                  </div>
                </div>
                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-xs text-secondary-blue-300">Phone</p>
                    <p className="text-sm text-white">
                      {client.phoneNumber || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">Created</p>
                    <p className="text-sm text-white">
                      {formatDate(client.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-blue-300">
                      Last Login
                    </p>
                    <p className="text-sm text-white">
                      {formatDate(client.lastLoginAt)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Subscription */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
                Subscription
              </h2>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-secondary-blue-300">
                    Subscription Plan
                  </p>
                  <div className="mt-1">
                    {client.subscriptionPlanName ? (
                      <Badge variant="info">
                        {client.subscriptionPlanName}
                      </Badge>
                    ) : (
                      <span className="text-secondary-blue-300">—</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/subscription-plans')}
                >
                  View Plan
                </Button>
              </div>
            </section>

            {/* Gyms */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                  Gyms ({gymOptions.length})
                </h2>
                <Button size="sm" onClick={() => router.push('/gyms')}>
                  View All Client Gyms
                </Button>
              </div>

              {gymOptions.length === 0 ? (
                <div className="text-center py-10 text-secondary-blue-300">
                  No gyms assigned to this client.
                </div>
              ) : (
                <DataTable
                  columns={gymColumns}
                  data={filteredGyms}
                  toolbar={(table) => (
                    <DataTableToolbar
                      table={table}
                      onSearch={setGymSearch}
                      searchPlaceholder="Search gyms..."
                    />
                  )}
                />
              )}
            </section>
          </div>
        ) : (
          <div className="text-center py-20 text-secondary-blue-300">
            Client not found.
          </div>
        )}
      </div>

      <Sheet
        isOpen={!!editGymId}
        onClose={() => setEditGymId(null)}
        title="Edit Gym"
        description="Update gym details for this client"
        width="xl"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditGymId(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="client-gym-edit-form"
              disabled={updateGymMutation.isPending}
            >
              {updateGymMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        }
      >
        {editGymId && isGymLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : gymDetail ? (
          <GymForm
            defaultValues={gymDetail}
            onSubmit={handleUpdateGym}
            onCancel={() => setEditGymId(null)}
            isLoading={updateGymMutation.isPending}
            formId="client-gym-edit-form"
            showActions={false}
          />
        ) : (
          <div className="text-center py-10 text-secondary-blue-300">
            Unable to load gym details.
          </div>
        )}
      </Sheet>
    </StudioLayout>
  );
}
