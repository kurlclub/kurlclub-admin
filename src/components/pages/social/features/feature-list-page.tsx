'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
  Tabs,
} from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import {
  useDeleteFeatureAnnouncement,
  useFeatureAnnouncements,
} from '@/services/social/feature-announcements';
import type {
  FeatureAnnouncement,
  FeatureAnnouncementStatus,
} from '@/types/feature-announcement';
import { getFeatureItems } from '@/types/feature-announcement';

import { createFeatureColumns } from './table/features-columns';

type StatusFilter = 'all' | FeatureAnnouncementStatus;

const filterFeatures = (
  features: FeatureAnnouncement[],
  term: string,
  status: StatusFilter,
): FeatureAnnouncement[] => {
  let result = features;
  if (status !== 'all') {
    result = result.filter((f) => f.status === status);
  }
  const normalized = term.trim().toLowerCase();
  if (!normalized) return result;
  return result.filter((f) => {
    const haystack = [
      f.version,
      ...getFeatureItems(f).flatMap((item) => [
        item.title,
        item.tag,
        item.description,
      ]),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
};

export function FeatureListPage() {
  const router = useRouter();
  const { data, isLoading } = useFeatureAnnouncements();
  const deleteMutation = useDeleteFeatureAnnouncement();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const features = useMemo(() => data?.features ?? [], [data?.features]);

  const filtered = useMemo(
    () => filterFeatures(features, searchTerm, statusFilter),
    [features, searchTerm, statusFilter],
  );

  const tabItems = useMemo(
    () => [
      { id: 'all', label: 'All' },
      {
        id: 'published',
        label: `Published (${features.filter((f) => f.status === 'published').length})`,
      },
      {
        id: 'draft',
        label: `Draft (${features.filter((f) => f.status === 'draft').length})`,
      },
    ],
    [features],
  );

  const handleDelete = useCallback(
    async (id: number, title: string) => {
      if (confirm(`Delete "${title}"? This cannot be undone.`)) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const columns = useMemo(
    () =>
      createFeatureColumns({
        onEdit: (id) => router.push(`/social/features/${id}/edit`),
        onDelete: handleDelete,
      }),
    [router, handleDelete],
  );

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Features</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Manage feature announcements
            </p>
          </div>
          <Button
            onClick={() => router.push('/social/features/new')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Feature
          </Button>
        </div>

        <Tabs
          items={tabItems}
          variant="underline"
          value={statusFilter}
          onTabChange={(id) => setStatusFilter(id as StatusFilter)}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : filtered.length > 0 ? (
          <DataTable
            columns={columns}
            data={filtered}
            toolbar={(table) => (
              <DataTableToolbar
                table={table}
                onSearch={setSearchTerm}
                searchPlaceholder="Search features..."
              />
            )}
          />
        ) : (
          <div className="py-20 text-center text-secondary-blue-300">
            {searchTerm
              ? 'No features match your search.'
              : statusFilter !== 'all'
                ? `No ${statusFilter} features.`
                : 'No features yet. Create your first announcement.'}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
