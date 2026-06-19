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
import { format, parseISO } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';

import type { FeatureAnnouncement } from '@/types/feature-announcement';

interface FeatureColumnActions {
  onEdit: (id: number) => void;
  onDelete: (id: number, title: string) => void;
}

export const createFeatureColumns = ({
  onEdit,
  onDelete,
}: FeatureColumnActions): ColumnDef<FeatureAnnouncement>[] => [
  {
    id: 'image',
    header: 'Image',
    cell: ({ row }) => {
      const { src, title } = row.original;
      return src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={title} className="h-10 w-16 rounded object-cover" />
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
    accessorKey: 'tag',
    header: 'Tag',
    cell: ({ row }) => (
      <span className="text-secondary-blue-200">{row.original.tag}</span>
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
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => {
      try {
        return (
          <span className="text-secondary-blue-200 text-sm">
            {format(parseISO(row.original.updatedAt), 'MMM dd, yyyy')}
          </span>
        );
      } catch {
        return (
          <span className="text-secondary-blue-200 text-sm">
            {row.original.updatedAt}
          </span>
        );
      }
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const feature = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(feature.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(feature.id, feature.title)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
