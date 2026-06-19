'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FileUploader, Input, Textarea } from '@kurlclub/ui-components';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import {
  type FieldErrors,
  type UseFormRegister,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

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
  status: z.enum(['draft', 'published']),
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
  status: 'draft',
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
  file: File | null;
  imageSrc: string;
  canRemove: boolean;
  onImageChange: (file: File | null) => void;
  onRemove: () => void;
}

function FeatureCard({
  index,
  register,
  errors,
  value,
  file,
  imageSrc,
  canRemove,
  onImageChange,
  onRemove,
}: FeatureCardProps) {
  const itemErrors = errors?.[index];
  const hasError = !!itemErrors;

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
            <FileUploader
              file={file}
              onChange={onImageChange}
              accept="image/*"
              label="Upload Image"
              existingFileUrl={imageSrc || null}
            />
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
    // Selected File per row, keyed by the field array's stable id so removing a
    // row doesn't mismatch files with the wrong index.
    const [imageFiles, setImageFiles] = useState<Record<string, File | null>>(
      {},
    );

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
            status: defaultValues.status,
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
        setImageFiles({});
      },
    }));

    // No upload API for now — read the file locally into a data URL.
    const handleImageChange = (
      index: number,
      fieldId: string,
      file: File | null,
    ) => {
      setImageFiles((prev) => ({ ...prev, [fieldId]: file }));
      if (!file) {
        setValue(`features.${index}.src`, '', { shouldValidate: true });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setValue(`features.${index}.src`, reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.onerror = () => {
        toast.error('Could not read the image. Please try again.');
        setImageFiles((prev) => ({ ...prev, [fieldId]: null }));
      };
      reader.readAsDataURL(file);
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
                  file={imageFiles[field.id] ?? null}
                  imageSrc={features[index]?.src ?? ''}
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
              {features.map((feature, index) => (
                <FeaturePreview key={index} data={feature} />
              ))}
            </div>
          </div>
        </div>
      </form>
    );
  },
);
