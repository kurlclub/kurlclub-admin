'use client';

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@kurlclub/ui-components';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

import type { Blog } from '@/types/blog';

interface BlogColumnActions {
  onEdit: (slug: string) => void;
  onDelete: (id: number, title: string) => void;
}

export const createBlogColumns = ({
  onEdit,
  onDelete,
}: BlogColumnActions): ColumnDef<Blog>[] => [
  {
    id: 'cover',
    header: 'Cover',
    cell: ({ row }) => {
      const { src, alt } = row.original.coverImage;
      return src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-10 w-16 rounded object-cover" />
      ) : (
        <div className="h-10 w-16 rounded bg-secondary-blue-800" />
      );
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-xs font-medium text-white">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: 'tagLabel',
    header: 'Tag',
    cell: ({ row }) => (
      <span className="text-secondary-blue-200">{row.original.tagLabel}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const published = row.original.status === 'published';
      return (
        <Badge variant={published ? 'default' : 'secondary'}>
          {published ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'displayDate',
    header: 'Date',
    cell: ({ row }) => {
      try {
        return (
          <span className="text-secondary-blue-200 text-sm">
            {format(new Date(row.original.displayDate), 'MMM dd, yyyy')}
          </span>
        );
      } catch {
        return (
          <span className="text-secondary-blue-200 text-sm">
            {row.original.displayDate}
          </span>
        );
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const blog = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(blog.slug)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(blog.id, blog.title)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
