'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FileUploader,
  Input,
  KDatePicker,
  Textarea,
} from '@kurlclub/ui-components';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useUploadBlogImage } from '@/services/social/blogs';
import type { Blog, BlogFormData } from '@/types/blog';

import { BlogPreview } from './blog-preview';
import { BlogSectionBuilder } from './blog-section-builder';

// ── Zod schema ───────────────────────────────────────────────────────────────

const sectionSchema = z.object({
  heading: z.string().optional(),
  paragraphs: z
    .array(z.string().min(1, 'Paragraph cannot be empty'))
    .min(1, 'At least one paragraph is required'),
  quote: z.string().optional(),
});

export const blogFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens',
    ),
  excerpt: z.string().min(1, 'Excerpt is required'),
  tagLabel: z.string().min(1, 'Tag is required'),
  displayDate: z.string().min(1, 'Date is required'),
  coverImage: z.object({
    src: z.string().min(1, 'Cover image is required'),
    alt: z.string().min(1, 'Alt text is required'),
  }),
  mainHeading: z.string().min(1, 'Card heading is required'),
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    bio: z.string().min(1, 'Author bio is required'),
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

// Walk a react-hook-form errors object (which nests by field/array) and return
// the first human-readable message, so we can show it in a toast.
const findFirstErrorMessage = (node: unknown): string | undefined => {
  if (!node || typeof node !== 'object') return undefined;
  const record = node as Record<string, unknown>;
  if (typeof record.message === 'string' && record.message) {
    return record.message;
  }
  for (const value of Object.values(record)) {
    const message = findFirstErrorMessage(value);
    if (message) return message;
  }
  return undefined;
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const DEFAULT_VALUES: BlogFormData = {
  title: '',
  slug: '',
  excerpt: '',
  tagLabel: '',
  displayDate: new Date().toISOString().split('T')[0],
  coverImage: { src: '', alt: '' },
  mainHeading: '',
  sections: [{ heading: '', paragraphs: [''], quote: '' }],
  author: { name: '', bio: '' },
  metaTitle: '',
  metaDescription: '',
  status: 'draft',
};

// ── Component ─────────────────────────────────────────────────────────────────

interface BlogFormProps {
  formId: string;
  defaultValues?: Blog;
  /** Persists the form. Return `false` to signal the save failed so the form
   *  keeps its dirty state; any other value (incl. void) counts as success. */
  onSave: (data: BlogFormData) => Promise<boolean | void>;
  /** Notifies the parent whenever the form's dirty state changes, so the
   *  action bar can show "Save" only when something has actually changed. */
  onDirtyChange?: (isDirty: boolean) => void;
}

export interface BlogFormHandle {
  reset: () => void;
}

export const BlogForm = forwardRef<BlogFormHandle, BlogFormProps>(
  function BlogForm({ formId, defaultValues, onSave, onDirtyChange }, ref) {
    const uploadMutation = useUploadBlogImage();
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const {
      register,
      control,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors, isDirty },
    } = useForm<BlogFormData>({
      resolver: zodResolver(blogFormSchema),
      defaultValues: defaultValues
        ? {
            title: defaultValues.title,
            slug: defaultValues.slug,
            excerpt: defaultValues.excerpt,
            tagLabel: defaultValues.tagLabel,
            displayDate: defaultValues.displayDate,
            coverImage: defaultValues.coverImage,
            mainHeading: defaultValues.mainHeading ?? '',
            sections: defaultValues.sections,
            author: defaultValues.author,
            metaTitle: defaultValues.metaTitle ?? '',
            metaDescription: defaultValues.metaDescription ?? '',
            status: defaultValues.status,
          }
        : DEFAULT_VALUES,
    });

    const titleValue = watch('title');
    const slugValue = watch('slug');
    const coverImage = watch('coverImage');
    const formValues = watch();

    // Expose a reset handler so the parent's action bar can clear the form.
    // Reverts to the loaded article (edit) or empty defaults (create).
    useImperativeHandle(ref, () => ({
      reset: () => {
        reset();
        setCoverFile(null);
      },
    }));

    // Keep the parent in sync with the form's dirty state.
    useEffect(() => {
      onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    // Auto-generate slug from title on create
    useEffect(() => {
      if (defaultValues) return;
      if (!titleValue) return;
      const autoSlug = slugify(titleValue);
      if (!slugValue || slugValue === slugify(titleValue.slice(0, -1))) {
        setValue('slug', autoSlug, { shouldValidate: false });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [titleValue]);

    const handleCoverFileChange = async (file: File | null) => {
      // Block removal while the upload is still in flight: clearing now would
      // race with the pending upload's setValue, so the "deleted" image would
      // reappear once the request resolves.
      if (!file && uploadMutation.isPending) {
        toast.info('Please wait for the image upload to finish.');
        return;
      }
      setCoverFile(file);
      if (file) {
        try {
          const { src } = await uploadMutation.mutateAsync(file);
          setValue(
            'coverImage',
            {
              src,
              alt: coverImage.alt || file.name.replace(/\.[^.]+$/, ''),
            },
            { shouldValidate: true, shouldDirty: true },
          );
        } catch {
          toast.error('Image upload failed. Please try again.');
          setCoverFile(null);
        }
      } else {
        setValue(
          'coverImage',
          { src: '', alt: '' },
          { shouldValidate: true, shouldDirty: true },
        );
      }
    };

    const errorClass = 'mt-1 text-xs text-red-400';

    // Surface validation failures: the action bar is sticky at the top while
    // the inline field errors render in the scrolling column below, so without
    // this the Publish / Save Draft buttons appear to do nothing.
    const onInvalid = (formErrors: typeof errors) => {
      const firstMessage = findFirstErrorMessage(formErrors);
      toast.error(
        firstMessage ?? 'Please fix the highlighted fields before saving.',
      );
    };

    const handleValidSubmit = async (data: BlogFormData) => {
      const result = await onSave(data);
      // Re-baseline to the saved values on success so the form is no longer
      // dirty (the Save button hides again until the next edit).
      if (result !== false) {
        reset(data);
      }
    };

    return (
      <form id={formId} onSubmit={handleSubmit(handleValidSubmit, onInvalid)}>
        <div className="grid grid-cols-[30%_1fr] gap-0">
          {/* ── Left: form fields (scrolls with the page) ────── */}
          <div className="space-y-4 border-r border-secondary-blue-500 pr-6">
            {/* Cover Image */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-blue-300">
                Cover Image <span className="text-red-400">*</span>
              </p>
              <FileUploader
                file={coverFile}
                onChange={handleCoverFileChange}
                accept="image/*"
                label="Upload Cover Image"
                existingFileUrl={coverImage.src || null}
              />
              {(errors.coverImage?.src?.message ||
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (errors.coverImage as any)?.message) && (
                <p className={errorClass}>
                  {errors.coverImage?.src?.message ??
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (errors.coverImage as any)?.message}
                </p>
              )}
              {/* Alt text appears once an image is uploaded */}
              {coverImage.src && (
                <div>
                  <Input
                    {...register('coverImage.alt')}
                    value={formValues.coverImage?.alt ?? ''}
                    label="Image Alt Text"
                    mandatory
                    placeholder="Describe the image"
                  />
                  {errors.coverImage?.alt && (
                    <p className={errorClass}>
                      {errors.coverImage.alt.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Main Heading */}
            <div>
              <Input
                {...register('mainHeading')}
                value={formValues.mainHeading ?? ''}
                label="Card Heading"
                mandatory
                placeholder="Article"
              />
              {errors.mainHeading && (
                <p className={errorClass}>{errors.mainHeading.message}</p>
              )}
            </div>

            {/* Tag */}
            <div>
              <Input
                {...register('tagLabel')}
                value={formValues.tagLabel ?? ''}
                label="Tag"
                mandatory
                placeholder="e.g. Fitness"
              />
              {errors.tagLabel && (
                <p className={errorClass}>{errors.tagLabel.message}</p>
              )}
            </div>

            {/* Display Date */}
            <div>
              <KDatePicker
                mode="single"
                label="Display Date"
                value={
                  watch('displayDate')
                    ? new Date(`${watch('displayDate')}T00:00:00`)
                    : undefined
                }
                onDateChange={(value) => {
                  if (value instanceof Date) {
                    setValue('displayDate', format(value, 'yyyy-MM-dd'), {
                      shouldValidate: true,
                    });
                  } else if (!value) {
                    setValue('displayDate', '', { shouldValidate: true });
                  }
                }}
              />
              {errors.displayDate && (
                <p className={errorClass}>{errors.displayDate.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <Input
                {...register('title')}
                value={formValues.title ?? ''}
                label="Title"
                mandatory
                placeholder="Article title"
              />
              {errors.title && (
                <p className={errorClass}>{errors.title.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <Textarea
                {...register('excerpt')}
                value={formValues.excerpt ?? ''}
                label="Excerpt"
                // placeholder="Short summary shown on listing pages"
                rows={3}
              />
              {errors.excerpt && (
                <p className={errorClass}>{errors.excerpt.message}</p>
              )}
            </div>

            {/* Sections */}
            <BlogSectionBuilder control={control} errors={errors.sections} />

            {/* Slug */}
            <div>
              <Input
                {...register('slug')}
                value={formValues.slug ?? ''}
                label="Slug"
                mandatory
                placeholder="url-friendly-slug"
              />
              {errors.slug ? (
                <p className={errorClass}>{errors.slug.message}</p>
              ) : slugValue ? (
                <p className="mt-1 text-xs text-secondary-blue-400">
                  /blogs/{slugValue}
                </p>
              ) : null}
            </div>

            {/* Author */}
            <div className="space-y-4 rounded-lg border border-secondary-blue-500 py-3 px-3">
              <h3 className="text-sm font-semibold text-white">Author</h3>
              <div>
                <Input
                  {...register('author.name')}
                  value={formValues.author?.name ?? ''}
                  label="Name"
                  mandatory
                  placeholder="Author name"
                />
                {errors.author?.name && (
                  <p className={errorClass}>{errors.author.name.message}</p>
                )}
              </div>
              <div>
                <Textarea
                  {...register('author.bio')}
                  value={formValues.author?.bio ?? ''}
                  label="Bio"
                  // placeholder="Author bio"
                  rows={2}
                />
                {errors.author?.bio && (
                  <p className={errorClass}>{errors.author.bio.message}</p>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="space-y-4 rounded-lg border border-secondary-blue-500 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">SEO</h3>
              <Input
                {...register('metaTitle')}
                value={formValues.metaTitle ?? ''}
                label="Meta Title"
                placeholder="SEO title"
              />
              <Textarea
                {...register('metaDescription')}
                value={formValues.metaDescription ?? ''}
                label="Meta Description"
                // placeholder="SEO description"
                rows={2}
              />
            </div>
          </div>

          <div className="pl-6">
            <div className="sticky top-32">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-secondary-blue-400">
                Preview
              </p>
              <BlogPreview data={formValues} />
            </div>
          </div>
        </div>
      </form>
    );
  },
);
