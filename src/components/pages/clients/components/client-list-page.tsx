'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import { DataTable, DataTableToolbar, Spinner } from '@kurlclub/ui-components';

import { createClientsColumns } from '@/components/pages/clients/table/clients-columns';
import { StudioLayout } from '@/components/shared/layout';
import { useClients } from '@/services/clients';
import type { Client } from '@/types/client';

const filterClients = (clients: Client[], term: string) => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return clients;
  return clients.filter((client) => {
    const haystack = [
      client.userName,
      client.email,
      client.phoneNumber,
      client.subscriptionPlanName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export function ClientListPage() {
  const router = useRouter();
  const { data: clients, isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(
    () =>
      createClientsColumns((clientId) => router.push(`/clients/${clientId}`)),
    [router],
  );

  const filteredClients = useMemo(
    () => filterClients(clients ?? [], searchTerm),
    [clients, searchTerm],
  );

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Clients</h1>
            <p className="text-sm text-secondary-blue-200 mt-1">
              Manage client accounts, gyms, and subscriptions
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : filteredClients.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredClients}
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                onSearch={setSearchTerm}
                searchPlaceholder="Search clients..."
              />
            )}
          />
        ) : (
          <div className="text-center py-20 text-secondary-blue-300">
            No clients found.
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
