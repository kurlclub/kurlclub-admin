'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Badge, Button, Spinner } from '@kurlclub/ui-components';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { useBlog, useCreateBlog, useUpdateBlog } from '@/services/social/blogs';
import type { BlogFormData, BlogStatus } from '@/types/blog';

import { BlogForm } from './components/blog-form';

interface BlogEditorPageProps {
  mode: 'create' | 'edit';
  slug?: string;
}

export function BlogEditorPage({ mode, slug }: BlogEditorPageProps) {
  const router = useRouter();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  const { data: blog, isLoading } = useBlog(slug ?? '');

  const pendingStatusRef = useRef<BlogStatus>('draft');
  const [pendingStatus, setPendingStatus] = useState<BlogStatus>('draft');

  const isPending = createMutation.isPending || updateMutation.isPending;
  const currentStatus = blog?.status ?? 'draft';

  const handleSave = async (data: BlogFormData) => {
    const payload: BlogFormData = { ...data, status: pendingStatusRef.current };
    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(payload);
        toast.success('Article saved');
        router.push(`/social/blogs/${created.slug}/edit`);
      } else if (blog) {
        await updateMutation.mutateAsync({ id: blog.id, data: payload });
        toast.success('Article updated');
      } else {
        toast.error(
          'Unable to save: article data not loaded yet. Please try again.',
        );
      }
    } catch {
      toast.error('Failed to save article');
    }
  };

  const triggerSubmit = (status: BlogStatus) => {
    pendingStatusRef.current = status;
    setPendingStatus(status);
    const form = document.getElementById(
      'blog-editor-form',
    ) as HTMLFormElement | null;
    form?.requestSubmit();
  };

  const isPublished = currentStatus === 'published';

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-secondary-blue-800 bg-background px-6 py-3">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => router.push('/social/blogs')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Button>
          {mode === 'edit' && (
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => triggerSubmit('draft')}
          >
            {isPending && pendingStatus === 'draft'
              ? 'Saving...'
              : 'Save Draft'}
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => triggerSubmit(isPublished ? 'draft' : 'published')}
          >
            {isPending && pendingStatus !== 'draft'
              ? 'Publishing...'
              : isPublished
                ? 'Unpublish'
                : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Content area — full width, no height constraint (preview uses sticky) */}
      <div className="px-6 py-6">
        {mode === 'edit' && isLoading ? (
          <div className="flex items-center justify-center py-40">
            <Spinner />
          </div>
        ) : mode === 'edit' && !blog ? (
          <div className="py-40 text-center text-secondary-blue-300">
            Article not found.
          </div>
        ) : (
          <BlogForm
            formId="blog-editor-form"
            defaultValues={blog}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
