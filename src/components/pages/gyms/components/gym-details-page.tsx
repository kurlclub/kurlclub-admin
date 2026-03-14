'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Badge,
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
} from '@kurlclub/ui-components';
import { ChevronLeft, Users } from 'lucide-react';

import { createGymMembersColumns } from '@/components/pages/gyms/table/gym-members-columns';
import { StudioLayout } from '@/components/shared/layout';
import { useGym, useGymMembers } from '@/services/gyms';

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : '—';

interface GymDetailsPageProps {
  gymId: number;
}

export function GymDetailsPage({ gymId }: GymDetailsPageProps) {
  const router = useRouter();
  const { data: gym, isLoading } = useGym(gymId);
  const { data: membersData, isLoading: isMembersLoading } = useGymMembers(
    gymId,
    { currentPage: 1, pageSize: 5 },
  );
  const [searchTerm, setSearchTerm] = useState('');

  const memberColumns = useMemo(() => createGymMembersColumns(), []);

  const filteredMembers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return membersData?.members ?? [];
    return (membersData?.members ?? []).filter((member) => {
      const haystack = [
        member.memberName,
        member.memberIdentifier,
        member.phone,
        member.gender,
        member.package,
        member.feeStatus,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [membersData?.members, searchTerm]);

  if (!Number.isFinite(gymId)) {
    return (
      <StudioLayout>
        <div className="text-center py-20 text-secondary-blue-300">
          Invalid gym identifier.
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
              <h1 className="text-2xl font-bold text-white">Gym Details</h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                View gym profile and member summary
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => router.push(`/gyms/${gymId}/members`)}
          >
            <Users className="h-4 w-4" />
            View Members
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : gym ? (
          <div className="space-y-6">
            {/* Gym Profile */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
                Gym Profile
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs text-secondary-blue-300">Gym Name</p>
                  <p className="text-sm text-white">{gym.gymName}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Location</p>
                  <p className="text-sm text-white">{gym.location || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Contact 1</p>
                  <p className="text-sm text-white">
                    {gym.contactNumber1 || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Contact 2</p>
                  <p className="text-sm text-white">
                    {gym.contactNumber2 || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Email</p>
                  <p className="text-sm text-white">{gym.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Status</p>
                  <div className="mt-1">
                    <Badge variant="info">{gym.status || '—'}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Identifier</p>
                  <p className="text-sm text-white">
                    {gym.gymIdentifier || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Created</p>
                  <p className="text-sm text-white">
                    {formatDate(gym.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-blue-300">Members</p>
                  <p className="text-sm text-white">{gym.memberCount ?? '—'}</p>
                </div>
              </div>
            </section>

            {/* Members */}
            <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                  Members Preview
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/gyms/${gymId}/members`)}
                >
                  View All Members
                </Button>
              </div>
              {isMembersLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Spinner />
                </div>
              ) : filteredMembers.length > 0 ? (
                <DataTable
                  columns={memberColumns}
                  data={filteredMembers}
                  toolbar={(table) => (
                    <DataTableToolbar
                      table={table}
                      onSearch={setSearchTerm}
                      searchPlaceholder="Search members..."
                    />
                  )}
                />
              ) : (
                <div className="text-center py-10 text-secondary-blue-300">
                  No members found for this gym.
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="text-center py-20 text-secondary-blue-300">
            Gym not found.
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
