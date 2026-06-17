'use client';

import { useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Badge, Button, Spinner, useAppDialog } from '@kurlclub/ui-components';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  useBlog,
  useCreateBlog,
  useDeleteBlog,
  useUpdateBlog,
} from '@/services/social/blogs';
import type { BlogFormData, BlogStatus } from '@/types/blog';

import { BlogForm, type BlogFormHandle } from './components/blog-form';

interface BlogEditorPageProps {
  mode: 'create' | 'edit';
  slug?: string;
}

export function BlogEditorPage({ mode, slug }: BlogEditorPageProps) {
  const router = useRouter();
  const { showConfirm } = useAppDialog();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();
  const deleteMutation = useDeleteBlog();

  const { data: blog, isLoading } = useBlog(slug ?? '');

  const pendingStatusRef = useRef<BlogStatus>('draft');
  const [pendingStatus, setPendingStatus] = useState<BlogStatus>('draft');
  const formRef = useRef<BlogFormHandle>(null);

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

  const handleReset = () => {
    formRef.current?.reset();
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

  // Switching a published article back to draft hides it from the site,
  // Save Draft only exists in create mode, so this is always a fresh draft.
  const handleSaveDraft = () => triggerSubmit('draft');

  const handlePublishToggle = () => {
    if (isPublished) {
      // Switching a published article back to draft hides it from the site.
      showConfirm({
        title: 'Unpublish article?',
        description:
          'This article will be hidden from kurlclub.com until you publish it again.',
        variant: 'destructive',
        confirmLabel: 'Unpublish',
        cancelLabel: 'Cancel',
        onConfirm: () => triggerSubmit('draft'),
      });
      return;
    }
    showConfirm({
      title: 'Publish article?',
      description: 'This article will be visible to everyone on kurlclub.com.',
      confirmLabel: 'Publish',
      cancelLabel: 'Cancel',
      onConfirm: () => triggerSubmit('published'),
    });
  };

  const handleDelete = () => {
    if (!blog) return;
    showConfirm({
      title: 'Delete article?',
      description: `"${blog.title}" will be permanently deleted. This cannot be undone.`,
      variant: 'destructive',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(blog.id);
          toast.success('Article deleted');
          router.push('/social/blogs');
        } catch {
          toast.error('Failed to delete article');
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-background-dark">
      {/* Sticky top bar */}
      <div className="sticky top-16 z-20 flex items-center justify-between border-b border-secondary-blue-700 bg-background-dark px-6 py-3">
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

      {/* Content area — full width, no height constraint (preview uses sticky) */}
      <div className="px-6 py-4">
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
            ref={formRef}
            formId="blog-editor-form"
            defaultValues={blog}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
