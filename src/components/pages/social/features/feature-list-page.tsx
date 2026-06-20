'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
  Tabs,
  useAppDialog,
} from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import {
  useDeleteFeatureAnnouncement,
  useFeatureAnnouncements,
  useUpdateFeatureAnnouncement,
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
  const { showConfirm } = useAppDialog();
  const { data, isLoading } = useFeatureAnnouncements();
  const deleteMutation = useDeleteFeatureAnnouncement();
  const updateMutation = useUpdateFeatureAnnouncement();

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
    (id: number, title: string) => {
      showConfirm({
        title: 'Delete Feature',
        description: `Delete "${title}"? This cannot be undone.`,
        variant: 'destructive',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
        // Fire-and-forget: don't await here, otherwise this dialog stays in its
        // loading state and blocks the global Prod request-guard dialog (they
        // share a single dialog instance).
        onConfirm: () => {
          deleteMutation.mutate(id);
        },
      });
    },
    [deleteMutation, showConfirm],
  );

  const handleToggleStatus = useCallback(
    (feature: FeatureAnnouncement) => {
      const nextStatus: FeatureAnnouncementStatus =
        feature.status === 'published' ? 'draft' : 'published';
      const publishing = nextStatus === 'published';
      const label =
        getFeatureItems(feature)[0]?.title || `Version ${feature.version}`;
      showConfirm({
        title: publishing ? 'Publish Feature' : 'Move to Draft',
        description: publishing
          ? `Publish "${label}"? It will be shown to users in the app.`
          : `Move "${label}" back to draft? It will be hidden from users.`,
        confirmLabel: publishing ? 'Publish' : 'Move to draft',
        cancelLabel: 'Cancel',
        // Fire-and-forget so this dialog closes immediately and frees the shared
        // dialog instance for the global Prod request-guard confirmation.
        // The PUT endpoint requires the full record (version / minimumVersion /
        // features), so send them alongside the flipped status.
        onConfirm: () => {
          updateMutation.mutate({
            id: feature.id,
            data: {
              version: feature.version,
              minimumVersion: feature.minimumVersion,
              features: getFeatureItems(feature),
              status: nextStatus,
            },
          });
        },
      });
    },
    [updateMutation, showConfirm],
  );

  const columns = useMemo(
    () =>
      createFeatureColumns({
        onEdit: (id) => router.push(`/social/features/${id}/edit`),
        onDelete: handleDelete,
        onToggleStatus: handleToggleStatus,
      }),
    [router, handleDelete, handleToggleStatus],
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
