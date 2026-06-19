'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Spinner, Textarea } from '@kurlclub/ui-components';
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, X } from 'lucide-react';
import {
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useUploadFeatureImage } from '@/services/social/feature-announcements';
import {
  type FeatureAnnouncement,
  type FeatureAnnouncementFormData,
  type FeatureItem,
  getFeatureItems,
} from '@/types/feature-announcement';

import { FeaturePreview } from './feature-preview';

// ── Zod schema ───────────────────────────────────────────────────────────────

const featureItemSchema = z.object({
  src: z.string().min(1, 'Image is required'),
  tag: z.string().min(1, 'Tag is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const featureFormSchema = z.object({
  version: z.string().min(1, 'Version is required'),
  minimumVersion: z.string().min(1, 'Minimum version is required'),
  features: z
    .array(featureItemSchema)
    .min(1, 'At least one feature is required'),
});

// ── Defaults ─────────────────────────────────────────────────────────────────

const EMPTY_FEATURE: FeatureItem = {
  src: '',
  tag: '',
  title: '',
  description: '',
};

const DEFAULT_VALUES: FeatureAnnouncementFormData = {
  version: '',
  minimumVersion: '',
  features: [{ ...EMPTY_FEATURE }],
};

const errorClass = 'mt-1 text-xs text-red-400';

// A feature is "complete" once all four of its fields are filled — used to gate
// the "Add Feature" button so a new slide can only be started after the current
// one is done.
const isFeatureComplete = (feature?: FeatureItem): boolean =>
  !!feature &&
  !!feature.src &&
  !!feature.tag.trim() &&
  !!feature.title.trim() &&
  !!feature.description.trim();

// ── Feature card ───────────────────────────────────────────────────────────────

interface FeatureCardProps {
  index: number;
  register: UseFormRegister<FeatureAnnouncementFormData>;
  errors: FieldErrors<FeatureAnnouncementFormData>['features'];
  // Current watched values for this row — passed so the floating labels know
  // the field has content (they key off the `value` prop, and register() alone
  // leaves the input uncontrolled).
  value: FeatureItem | undefined;
  imageSrc: string;
  uploading: boolean;
  canRemove: boolean;
  onImageChange: (file: File | null) => void;
  onRemove: () => void;
}

function FeatureCard({
  index,
  register,
  errors,
  value,
  imageSrc,
  uploading,
  canRemove,
  onImageChange,
  onRemove,
}: FeatureCardProps) {
  const itemErrors = errors?.[index];
  const hasError = !!itemErrors;
  // Own ref per card — avoids the shared-DOM-id collision that a label-based
  // file input would cause when several uploaders are mounted at once.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onImageChange(file);
    // Reset so picking the same file again still fires onChange.
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Collapsed by default once a feature is filled in; new/empty features start
  // expanded so there's something to fill.
  const [open, setOpen] = useState(() => !isFeatureComplete(value));

  // Force-expand whenever this feature has validation errors (e.g. after a
  // failed submit) so the user can see what needs fixing even if collapsed.
  const expanded = open || hasError;

  return (
    <div className="overflow-hidden rounded-lg border border-secondary-blue-700">
      {/* Accordion header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex flex-1 items-center gap-2 overflow-hidden text-left"
          aria-expanded={expanded}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 shrink-0 text-secondary-blue-300" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0 text-secondary-blue-300" />
          )}
          <span className="shrink-0 text-xs font-medium text-secondary-blue-400">
            Feature {index + 1}
          </span>
          <span className="truncate text-sm font-semibold text-secondary-blue-100">
            {value?.title?.trim() || 'Untitled feature'}
          </span>
          {hasError && (
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-red-500"
              title="This feature has missing or invalid fields"
            />
          )}
        </button>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 w-7 shrink-0 p-0 text-red-400 hover:text-red-300"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Accordion body */}
      {expanded && (
        <div className="space-y-4 border-t border-secondary-blue-700 p-4">
          {/* Image */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-secondary-blue-300">
              Image <span className="text-red-400">*</span>
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />

            {imageSrc ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={value?.title || 'Feature image'}
                  className="h-40 w-full rounded-lg object-cover"
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                    <Spinner />
                  </div>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 bg-black/50 p-0 hover:bg-black/70"
                  onClick={() => onImageChange(null)}
                >
                  <X className="h-3 w-3 text-white" />
                </Button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-secondary-blue-700 text-secondary-blue-300 transition-colors hover:border-secondary-blue-500 hover:text-secondary-blue-200 disabled:opacity-50"
              >
                {uploading ? (
                  <Spinner />
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span className="text-sm font-medium text-secondary-blue-100">
                      Upload Image
                    </span>
                    <span className="text-xs text-secondary-blue-400">
                      JPG, PNG (Max 4MB)
                    </span>
                  </>
                )}
              </button>
            )}

            {itemErrors?.src && (
              <p className={errorClass}>{itemErrors.src.message}</p>
            )}
          </div>

          {/* Tag */}
          <div>
            <Input
              {...register(`features.${index}.tag`)}
              value={value?.tag ?? ''}
              label="Tag"
              mandatory
              placeholder="e.g. New"
            />
            {itemErrors?.tag && (
              <p className={errorClass}>{itemErrors.tag.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <Input
              {...register(`features.${index}.title`)}
              value={value?.title ?? ''}
              label="Title"
              mandatory
              placeholder="Feature title"
            />
            {itemErrors?.title && (
              <p className={errorClass}>{itemErrors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Textarea
              {...register(`features.${index}.description`)}
              value={value?.description ?? ''}
              label="Description"
              rows={4}
            />
            {itemErrors?.description && (
              <p className={errorClass}>{itemErrors.description.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface FeatureFormProps {
  formId: string;
  defaultValues?: FeatureAnnouncement;
  onSave: (data: FeatureAnnouncementFormData) => Promise<void>;
}

export interface FeatureFormHandle {
  reset: () => void;
}

export const FeatureForm = forwardRef<FeatureFormHandle, FeatureFormProps>(
  function FeatureForm({ formId, defaultValues, onSave }, ref) {
    // Rows with an upload currently in flight, keyed by the field array's stable
    // id so removing a row doesn't mismatch the flag with the wrong index.
    const [uploadingFields, setUploadingFields] = useState<
      Record<string, boolean>
    >({});

    const uploadImage = useUploadFeatureImage();

    const {
      register,
      control,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FeatureAnnouncementFormData>({
      resolver: zodResolver(featureFormSchema),
      defaultValues: defaultValues
        ? {
            version: defaultValues.version ?? '',
            minimumVersion: defaultValues.minimumVersion ?? '',
            features: getFeatureItems(defaultValues).length
              ? getFeatureItems(defaultValues)
              : [{ ...EMPTY_FEATURE }],
          }
        : DEFAULT_VALUES,
    });

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'features',
    });

    // useWatch (a hook) instead of watch() so React Compiler can memoize safely.
    const formValues = useWatch({ control }) as FeatureAnnouncementFormData;
    const features = formValues.features ?? [];

    // Expose a reset handler so the parent's action bar can clear the form.
    useImperativeHandle(ref, () => ({
      reset: () => {
        reset();
      },
    }));

    // Upload the selected file to the backend and store the returned URL in the
    // row's `src` field.
    const handleImageChange = async (
      index: number,
      fieldId: string,
      file: File | null,
    ) => {
      if (!file) {
        setValue(`features.${index}.src`, '', { shouldValidate: true });
        return;
      }
      setUploadingFields((prev) => ({ ...prev, [fieldId]: true }));
      try {
        const { src } = await uploadImage.mutateAsync(file);
        setValue(`features.${index}.src`, src, { shouldValidate: true });
      } catch {
        toast.error('Image upload failed. Please try again.');
        setValue(`features.${index}.src`, '', { shouldValidate: true });
      } finally {
        setUploadingFields((prev) => ({ ...prev, [fieldId]: false }));
      }
    };

    const canAddFeature = isFeatureComplete(features[features.length - 1]);

    return (
      <form id={formId} onSubmit={handleSubmit(onSave)}>
        <div className="grid grid-cols-[35%_1fr] gap-0">
          {/* ── Left: form fields ─────────────────────────────── */}
          <div className="space-y-5 border-r border-secondary-blue-800 pr-6">
            {/* Version */}
            <div>
              <Input
                {...register('version')}
                value={formValues.version ?? ''}
                label="Version"
                mandatory
                placeholder="e.g. 2.4.0"
              />
              {errors.version && (
                <p className={errorClass}>{errors.version.message}</p>
              )}
            </div>

            {/* Minimum version */}
            <div>
              <Input
                {...register('minimumVersion')}
                value={formValues.minimumVersion ?? ''}
                label="Minimum version"
                mandatory
                placeholder="e.g. 2.0.0"
              />
              {errors.minimumVersion && (
                <p className={errorClass}>{errors.minimumVersion.message}</p>
              )}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">
                Features <span className="text-red-400">*</span>
              </h3>

              {fields.map((field, index) => (
                <FeatureCard
                  key={field.id}
                  index={index}
                  register={register}
                  errors={errors.features}
                  value={features[index]}
                  imageSrc={features[index]?.src ?? ''}
                  uploading={uploadingFields[field.id] ?? false}
                  canRemove={fields.length > 1}
                  onImageChange={(file) =>
                    handleImageChange(index, field.id, file)
                  }
                  onRemove={() => remove(index)}
                />
              ))}

              {typeof errors.features?.message === 'string' && (
                <p className={errorClass}>{errors.features.message}</p>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={!canAddFeature}
                onClick={() => append({ ...EMPTY_FEATURE })}
              >
                <Plus className="h-4 w-4" />
                Add Feature
              </Button>
              {!canAddFeature && (
                <p className="text-xs text-secondary-blue-400">
                  Fill in the current feature before adding another.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: sticky live preview ────────────────────── */}
          <div className="pl-6">
            <div className="sticky top-14 max-h-[calc(100vh-80px)] space-y-6 overflow-y-auto">
              <p className="text-xs font-semibold uppercase tracking-widest text-secondary-blue-400">
                Preview
              </p>
              <FeaturePreview features={features} />
            </div>
          </div>
        </div>
      </form>
    );
  },
);
