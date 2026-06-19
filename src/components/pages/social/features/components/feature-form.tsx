'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { FileUploader, Input, Textarea } from '@kurlclub/ui-components';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import type {
  FeatureAnnouncement,
  FeatureAnnouncementFormData,
} from '@/types/feature-announcement';

import { FeaturePreview } from './feature-preview';

// ── Zod schema ───────────────────────────────────────────────────────────────

export const featureFormSchema = z.object({
  src: z.string().min(1, 'Image is required'),
  tag: z.string().min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['draft', 'published']),
});

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_VALUES: FeatureAnnouncementFormData = {
  src: '',
  tag: '',
  title: '',
  description: '',
  status: 'draft',
};

// ── Component ─────────────────────────────────────────────────────────────────

interface FeatureFormProps {
  formId: string;
  defaultValues?: FeatureAnnouncement;
  onSave: (data: FeatureAnnouncementFormData) => Promise<void>;
}

export function FeatureForm({
  formId,
  defaultValues,
  onSave,
}: FeatureFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FeatureAnnouncementFormData>({
    resolver: zodResolver(featureFormSchema),
    defaultValues: defaultValues
      ? {
          src: defaultValues.src,
          tag: defaultValues.tag,
          title: defaultValues.title,
          description: defaultValues.description,
          status: defaultValues.status,
        }
      : DEFAULT_VALUES,
  });

  // useWatch (a hook) instead of watch() so React Compiler can memoize safely.
  const formValues = useWatch({ control }) as FeatureAnnouncementFormData;
  const src = formValues.src;

  // No upload API for now — read the file locally into a data URL.
  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setValue('src', '', { shouldValidate: true });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValue('src', reader.result as string, { shouldValidate: true });
    };
    reader.onerror = () => {
      toast.error('Could not read the image. Please try again.');
      setImageFile(null);
    };
    reader.readAsDataURL(file);
  };

  const errorClass = 'mt-1 text-xs text-red-400';

  return (
    <form id={formId} onSubmit={handleSubmit(onSave)}>
      <div className="grid grid-cols-[25%_1fr] gap-0">
        {/* ── Left: form fields ─────────────────────────────── */}
        <div className="space-y-5 border-r border-secondary-blue-800 pr-6 pb-20">
          {/* Image */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-secondary-blue-300">
              Image <span className="text-red-400">*</span>
            </p>
            <FileUploader
              file={imageFile}
              onChange={handleImageChange}
              accept="image/*"
              label="Upload Image"
              existingFileUrl={src || null}
            />
            {errors.src && <p className={errorClass}>{errors.src.message}</p>}
          </div>

          {/* Tag */}
          <div>
            <Input
              {...register('tag')}
              label="Tag"
              mandatory
              placeholder="e.g. New"
            />
            {errors.tag && <p className={errorClass}>{errors.tag.message}</p>}
          </div>

          {/* Title */}
          <div>
            <Input
              {...register('title')}
              label="Title"
              mandatory
              placeholder="Feature title"
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Textarea
              {...register('description')}
              label="Description"
              placeholder="Describe the feature"
              rows={4}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* ── Right: sticky live preview ────────────────────── */}
        <div className="pl-6">
          <div className="sticky top-14 max-h-[calc(100vh-80px)] overflow-y-auto">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary-blue-400">
              Preview
            </p>
            <FeaturePreview data={formValues} />
          </div>
        </div>
      </div>
    </form>
  );
}
