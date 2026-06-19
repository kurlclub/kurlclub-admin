'use client';

import { useRef } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Spinner } from '@kurlclub/ui-components';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import {
  useCreateFeatureAnnouncement,
  useFeatureAnnouncement,
  useUpdateFeatureAnnouncement,
} from '@/services/social/feature-announcements';
import type { FeatureAnnouncementFormData } from '@/types/feature-announcement';

import { FeatureForm, type FeatureFormHandle } from './components/feature-form';

interface FeatureEditorPageProps {
  mode: 'create' | 'edit';
  id?: number;
}

export function FeatureEditorPage({ mode, id }: FeatureEditorPageProps) {
  const router = useRouter();
  const createMutation = useCreateFeatureAnnouncement();
  const updateMutation = useUpdateFeatureAnnouncement();

  const { data: feature, isLoading } = useFeatureAnnouncement(id ?? 0);

  const formRef = useRef<FeatureFormHandle>(null);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSave = async (data: FeatureAnnouncementFormData) => {
    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(data);
        toast.success('Feature saved');
        router.push(`/social/features/${created.id}/edit`);
      } else if (feature) {
        await updateMutation.mutateAsync({ id: feature.id, data });
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
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="feature-editor-form"
            size="sm"
            disabled={isPending}
          >
            {isPending
              ? 'Saving...'
              : mode === 'create'
                ? 'Save'
                : 'Save Changes'}
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
