'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Badge, Button, Spinner, useAppDialog } from '@kurlclub/ui-components';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  useCreateFeatureAnnouncement,
  useDeleteFeatureAnnouncement,
  useFeatureAnnouncement,
  useUpdateFeatureAnnouncement,
} from '@/services/social/feature-announcements';
import type {
  FeatureAnnouncementFormData,
  FeatureAnnouncementStatus,
} from '@/types/feature-announcement';

import { FeatureForm, type FeatureFormHandle } from './components/feature-form';

interface FeatureEditorPageProps {
  mode: 'create' | 'edit';
  id?: number;
}

export function FeatureEditorPage({ mode, id }: FeatureEditorPageProps) {
  const router = useRouter();
  const { showConfirm } = useAppDialog();
  const createMutation = useCreateFeatureAnnouncement();
  const updateMutation = useUpdateFeatureAnnouncement();
  const deleteMutation = useDeleteFeatureAnnouncement();

  const { data: feature, isLoading } = useFeatureAnnouncement(id ?? 0);

  const pendingStatusRef = useRef<FeatureAnnouncementStatus>('draft');
  const [pendingStatus, setPendingStatus] =
    useState<FeatureAnnouncementStatus>('draft');
  const formRef = useRef<FeatureFormHandle>(null);

  const isPending = createMutation.isPending || updateMutation.isPending;
  const currentStatus = feature?.status ?? 'draft';
  const isPublished = currentStatus === 'published';

  const handleSave = async (data: FeatureAnnouncementFormData) => {
    const payload: FeatureAnnouncementFormData = {
      ...data,
      status: pendingStatusRef.current,
    };
    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(payload);
        toast.success('Feature saved');
        router.push(`/social/features/${created.id}/edit`);
      } else if (feature) {
        await updateMutation.mutateAsync({ id: feature.id, data: payload });
        toast.success('Feature updated');
      } else {
        toast.error(
          'Unable to save: feature data not loaded yet. Please try again.',
        );
      }
    } catch {
      toast.error('Failed to save feature');
    }
  };

  const handleReset = () => {
    formRef.current?.reset();
  };

  const triggerSubmit = (status: FeatureAnnouncementStatus) => {
    pendingStatusRef.current = status;
    setPendingStatus(status);
    const form = document.getElementById(
      'feature-editor-form',
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const handleSaveDraft = () => triggerSubmit('draft');

  const handlePublishToggle = () => {
    if (isPublished) {
      // Switching a published announcement back to draft hides it from users.
      showConfirm({
        title: 'Unpublish feature?',
        description:
          'This announcement will be hidden from users until you publish it again.',
        variant: 'destructive',
        confirmLabel: 'Unpublish',
        cancelLabel: 'Cancel',
        onConfirm: () => triggerSubmit('draft'),
      });
      return;
    }
    showConfirm({
      title: 'Publish feature?',
      description: 'This announcement will be shown to users in the app.',
      confirmLabel: 'Publish',
      cancelLabel: 'Cancel',
      onConfirm: () => triggerSubmit('published'),
    });
  };

  const handleDelete = () => {
    if (!feature) return;
    showConfirm({
      title: 'Delete feature?',
      description: `Version "${feature.version}" will be permanently deleted. This cannot be undone.`,
      variant: 'destructive',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(feature.id);
          toast.success('Feature deleted');
          router.push('/social/features');
        } catch {
          toast.error('Failed to delete feature');
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Sticky top bar */}
      <div className="sticky top-16 z-20 flex items-center justify-between border-b border-secondary-blue-800 bg-background-dark px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => router.push('/social/features')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Features
          </Button>
          {mode === 'edit' && (
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode === 'edit' && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="gap-1.5"
              disabled={isPending || deleteMutation.isPending}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          )}
          {mode === 'create' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
          {mode === 'create' && (
            <Button
              type="button"
              variant="outlinePrimary"
              size="sm"
              disabled={isPending}
              onClick={handleSaveDraft}
            >
              {isPending && pendingStatus === 'draft'
                ? 'Saving...'
                : 'Save Draft'}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={handlePublishToggle}
          >
            {isPending && pendingStatus !== 'draft'
              ? 'Publishing...'
              : isPublished
                ? 'Unpublish'
                : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="px-6 py-6">
        {mode === 'edit' && isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Spinner />
          </div>
        ) : mode === 'edit' && !feature ? (
          <div className="py-40 text-center text-secondary-blue-300">
            Feature not found.
          </div>
        ) : (
          <FeatureForm
            ref={formRef}
            formId="feature-editor-form"
            defaultValues={feature}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
