'use client';

import { useCallback, useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Button,
  DataTable,
  DataTableToolbar,
  Spinner,
} from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import { useBlogs, useDeleteBlog } from '@/services/social/blogs';
import type { Blog, BlogStatus } from '@/types/blog';

import { createBlogColumns } from './table/blogs-columns';

type StatusFilter = 'all' | BlogStatus;

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

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

  const blogs = data?.blogs ?? [];

  const filtered = useMemo(
    () => filterBlogs(blogs, searchTerm, statusFilter),
    [blogs, searchTerm, statusFilter],
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
            <p className="text-sm text-secondary-blue-200 mt-1">
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

        {/* Status Tabs */}
        <div className="flex gap-1 border-b border-secondary-blue-800">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={[
                'px-4 py-2 text-sm font-medium transition-colors',
                statusFilter === tab.value
                  ? 'border-b-2 border-white text-white'
                  : 'text-secondary-blue-300 hover:text-white',
              ].join(' ')}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({blogs.filter((b) => b.status === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

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
          <div className="text-center py-20 text-secondary-blue-300">
            {searchTerm
              ? 'No articles match your search.'
              : 'No articles yet. Create your first blog post.'}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
