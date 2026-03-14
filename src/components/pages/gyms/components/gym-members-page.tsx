'use client';

import { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Input,
  Spinner,
} from '@kurlclub/ui-components';
import { ChevronLeft } from 'lucide-react';

import { createGymMembersColumns } from '@/components/pages/gyms/table/gym-members-columns';
import { StudioLayout } from '@/components/shared/layout';
import { useGymMembers } from '@/services/gyms';

interface GymMembersPageProps {
  gymId: number;
}

const FEE_STATUS_OPTIONS = ['', 'Paid', 'Unpaid', 'Pending'];
const GENDER_OPTIONS = ['', 'Male', 'Female', 'Other'];
const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
];
const PAGE_SIZES = [10, 20, 50];

type MemberFilters = {
  search: string;
  feeStatus: string;
  package: string;
  gender: string;
  trainer: string;
  sort: string;
  currentPage: number;
  pageSize: number;
};

export function GymMembersPage({ gymId }: GymMembersPageProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<MemberFilters>({
    search: '',
    feeStatus: '',
    package: '',
    gender: '',
    trainer: '',
    sort: '',
    currentPage: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useGymMembers(gymId, filters);

  const pagination = useMemo(
    () => ({
      currentPage: data?.currentPage ?? filters.currentPage,
      totalPages: data?.totalPages ?? 1,
      totalCount: data?.totalCount,
    }),
    [data, filters.currentPage],
  );

  const updateFilter = <K extends keyof MemberFilters>(
    key: K,
    value: MemberFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      currentPage: key === 'currentPage' ? Number(value) : 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      feeStatus: '',
      package: '',
      gender: '',
      trainer: '',
      sort: '',
      currentPage: 1,
      pageSize: 10,
    });
  };

  const columns = useMemo(
    () =>
      createGymMembersColumns({
        onView: (identifier) => router.push(`/members/${identifier}`),
      }),
    [router],
  );

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
              <h1 className="text-2xl font-bold text-white">Gym Members</h1>
              <p className="text-sm text-secondary-blue-200 mt-1">
                Browse and filter members for this gym
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>

        <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Package"
              value={filters.package}
              onChange={(event) => updateFilter('package', event.target.value)}
              placeholder="Package"
            />
            <Input
              label="Trainer"
              value={filters.trainer}
              onChange={(event) => updateFilter('trainer', event.target.value)}
              placeholder="Trainer"
            />
            <select
              value={filters.feeStatus}
              onChange={(event) =>
                updateFilter('feeStatus', event.target.value)
              }
              aria-label="Fee Status"
              className="h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            >
              {FEE_STATUS_OPTIONS.map((status) => (
                <option
                  key={status || 'all'}
                  value={status}
                  className="text-black"
                >
                  {status || 'Fee Status'}
                </option>
              ))}
            </select>
            <select
              value={filters.gender}
              onChange={(event) => updateFilter('gender', event.target.value)}
              aria-label="Gender"
              className="h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            >
              {GENDER_OPTIONS.map((gender) => (
                <option
                  key={gender || 'all'}
                  value={gender}
                  className="text-black"
                >
                  {gender || 'Gender'}
                </option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(event) => updateFilter('sort', event.target.value)}
              aria-label="Sort"
              className="h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value || 'default'}
                  value={option.value}
                  className="text-black"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : data && data.members.length > 0 ? (
          <div className="[&>div>div:last-child]:hidden">
            <DataTable
              columns={columns}
              data={data.members}
              toolbar={(table) => (
                <DataTableToolbar
                  table={table}
                  onSearch={(term) => updateFilter('search', term)}
                  searchPlaceholder="Search members..."
                />
              )}
            />
          </div>
        ) : (
          <div className="text-center py-20 text-secondary-blue-300">
            No members found.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-secondary-blue-200">
            <span>Page</span>
            <span className="text-white font-semibold">
              {pagination.currentPage}
            </span>
            <span>of</span>
            <span className="text-white font-semibold">
              {pagination.totalPages}
            </span>
            {typeof pagination.totalCount === 'number' && (
              <span className="text-secondary-blue-300">
                ({pagination.totalCount} total)
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.pageSize}
              onChange={(event) =>
                updateFilter('pageSize', Number(event.target.value))
              }
              aria-label="Page Size"
              className="h-10 rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size} className="text-black">
                  {size} / page
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.currentPage <= 1}
              onClick={() =>
                updateFilter('currentPage', pagination.currentPage - 1)
              }
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pagination.currentPage >= pagination.totalPages}
              onClick={() =>
                updateFilter('currentPage', pagination.currentPage + 1)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </StudioLayout>
  );
}
