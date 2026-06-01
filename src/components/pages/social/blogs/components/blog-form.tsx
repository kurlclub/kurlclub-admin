'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Blog, BlogFormData } from '@/types/blog';

import { BlogImageUpload } from './blog-image-upload';
import { BlogSectionBuilder } from './blog-section-builder';

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
  mainHeading: z.string().min(1, 'Main heading is required'),
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
  author: z.object({
    name: z.string().min(1, 'Author name is required'),
    bio: z.string().min(1, 'Author bio is required'),
  }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

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

interface BlogFormProps {
  formId: string;
  defaultValues?: Blog;
  onSave: (data: BlogFormData) => Promise<void>;
}

export function BlogForm({ formId, defaultValues, onSave }: BlogFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
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
          mainHeading: defaultValues.mainHeading,
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

  useEffect(() => {
    if (defaultValues) return;
    if (!titleValue) return;
    const autoSlug = slugify(titleValue);
    if (!slugValue || slugValue === slugify(titleValue.slice(0, -1))) {
      setValue('slug', autoSlug, { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleValue]);

  const fieldClass =
    'w-full rounded border border-secondary-blue-700 bg-secondary-blue-900 px-3 py-2 text-sm text-white placeholder-secondary-blue-400 focus:outline-none focus:ring-1 focus:ring-white';
  const labelClass = 'block text-xs font-medium text-secondary-blue-300 mb-1';
  const errorClass = 'mt-1 text-xs text-red-400';

  return (
    <form id={formId} onSubmit={handleSubmit(onSave)} className="h-full">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* ── Left: Content ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className={labelClass}>
              Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register('title')}
              placeholder="Article title"
              className={fieldClass}
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div>
            <label className={labelClass}>
              Excerpt <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('excerpt')}
              placeholder="Short summary shown on listing pages"
              rows={3}
              className={`${fieldClass} resize-y`}
            />
            {errors.excerpt && (
              <p className={errorClass}>{errors.excerpt.message}</p>
            )}
          </div>

          {/* Main Heading */}
          <div>
            <label className={labelClass}>
              Main Heading (H1) <span className="text-red-400">*</span>
            </label>
            <input
              {...register('mainHeading')}
              placeholder="Article H1"
              className={fieldClass}
            />
            {errors.mainHeading && (
              <p className={errorClass}>{errors.mainHeading.message}</p>
            )}
          </div>

          {/* Sections */}
          <BlogSectionBuilder control={control} errors={errors.sections} />
        </div>

        {/* ── Right: Settings ───────────────────────────────── */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div>
            <label className={labelClass}>
              Cover Image <span className="text-red-400">*</span>
            </label>
            <BlogImageUpload
              value={watch('coverImage')}
              onChange={(v) =>
                setValue('coverImage', v, { shouldValidate: true })
              }
              error={
                errors.coverImage?.src?.message ??
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (errors.coverImage as any)?.message
              }
            />
          </div>

          {/* Slug */}
          <div>
            <label className={labelClass}>
              Slug <span className="text-red-400">*</span>
            </label>
            <input
              {...register('slug')}
              placeholder="url-friendly-slug"
              className={fieldClass}
            />
            {errors.slug ? (
              <p className={errorClass}>{errors.slug.message}</p>
            ) : slugValue ? (
              <p className="mt-1 text-xs text-secondary-blue-400">
                /blogs/{slugValue}
              </p>
            ) : null}
          </div>

          {/* Tag */}
          <div>
            <label className={labelClass}>
              Tag <span className="text-red-400">*</span>
            </label>
            <input
              {...register('tagLabel')}
              placeholder="e.g. Fitness"
              className={fieldClass}
            />
            {errors.tagLabel && (
              <p className={errorClass}>{errors.tagLabel.message}</p>
            )}
          </div>

          {/* Display Date */}
          <div>
            <label className={labelClass}>
              Display Date <span className="text-red-400">*</span>
            </label>
            <input
              {...register('displayDate')}
              type="date"
              className={fieldClass}
            />
            {errors.displayDate && (
              <p className={errorClass}>{errors.displayDate.message}</p>
            )}
          </div>

          {/* Author */}
          <div className="space-y-3 rounded-lg border border-secondary-blue-700 p-4">
            <h3 className="text-sm font-semibold text-white">Author</h3>
            <div>
              <label className={labelClass}>
                Name <span className="text-red-400">*</span>
              </label>
              <input
                {...register('author.name')}
                placeholder="Author name"
                className={fieldClass}
              />
              {errors.author?.name && (
                <p className={errorClass}>{errors.author.name.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                Bio <span className="text-red-400">*</span>
              </label>
              <textarea
                {...register('author.bio')}
                placeholder="Author bio"
                rows={2}
                className={`${fieldClass} resize-y`}
              />
              {errors.author?.bio && (
                <p className={errorClass}>{errors.author.bio.message}</p>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-3 rounded-lg border border-secondary-blue-700 p-4">
            <h3 className="text-sm font-semibold text-white">SEO</h3>
            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                {...register('metaTitle')}
                placeholder="SEO title"
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                {...register('metaDescription')}
                placeholder="SEO description"
                rows={2}
                className={`${fieldClass} resize-y`}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
