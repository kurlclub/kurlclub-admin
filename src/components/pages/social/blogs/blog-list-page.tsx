'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
  Tabs,
} from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { useBlogs, useDeleteBlog } from '@/services/social/blogs';
import type { Blog, BlogStatus } from '@/types/blog';

import { createBlogColumns } from './table/blogs-columns';

type StatusFilter = 'all' | BlogStatus;

const filterBlogs = (
  blogs: Blog[],
  term: string,
  status: StatusFilter,
): Blog[] => {
  let result = blogs;
  if (status !== 'all') {
    result = result.filter((b) => b.status === status);
  }
  const normalized = term.trim().toLowerCase();
  if (!normalized) return result;
  return result.filter((b) =>
    [b.title, b.tagLabel, b.slug].join(' ').toLowerCase().includes(normalized),
  );
};

export function BlogListPage() {
  const router = useRouter();
  const { data, isLoading } = useBlogs();
  const deleteMutation = useDeleteBlog();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const blogs = useMemo(() => data?.blogs ?? [], [data?.blogs]);

  const filtered = useMemo(
    () => filterBlogs(blogs, searchTerm, statusFilter),
    [blogs, searchTerm, statusFilter],
  );

  const tabItems = useMemo(
    () => [
      { id: 'all', label: 'All' },
      {
        id: 'published',
        label: `Published (${blogs.filter((b) => b.status === 'published').length})`,
      },
      {
        id: 'draft',
        label: `Draft (${blogs.filter((b) => b.status === 'draft').length})`,
      },
    ],
    [blogs],
  );

  const handleDelete = useCallback(
    async (id: number, title: string) => {
      if (confirm(`Delete "${title}"? This cannot be undone.`)) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const columns = useMemo(
    () =>
      createBlogColumns({
        onEdit: (slug) => router.push(`/social/blogs/${slug}/edit`),
        onDelete: handleDelete,
      }),
    [router, handleDelete],
  );

  return (
    <StudioLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Blogs</h1>
            <p className="mt-1 text-sm text-secondary-blue-200">
              Manage your blog content
            </p>
          </div>
          <Button
            onClick={() => router.push('/social/blogs/new')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            New Article
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
                searchPlaceholder="Search articles..."
              />
            )}
          />
        ) : (
          <div className="py-20 text-center text-secondary-blue-300">
            {searchTerm
              ? 'No articles match your search.'
              : statusFilter !== 'all'
                ? `No ${statusFilter} articles.`
                : 'No articles yet. Create your first blog post.'}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
