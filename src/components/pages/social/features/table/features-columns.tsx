'use client';

import {
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
import { getFeatureItems } from '@/types/feature-announcement';

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
      const first = getFeatureItems(row.original)[0];
      return first?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={first.src}
          alt={first.title}
          className="h-10 w-16 rounded object-cover"
        />
      ) : (
        <div className="h-10 w-16 rounded bg-secondary-blue-800" />
      );
    },
  },
  {
    id: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const items = getFeatureItems(row.original);
      const extra = items.length - 1;
      return (
        <div className="max-w-xs">
          <span className="line-clamp-2 font-medium text-white">
            {items[0]?.title}
          </span>
          {extra > 0 && (
            <span className="text-xs text-secondary-blue-300">
              +{extra} more {extra === 1 ? 'feature' : 'features'}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: 'tag',
    header: 'Tag',
    cell: ({ row }) => (
      <span className="text-secondary-blue-200">
        {getFeatureItems(row.original)[0]?.tag}
      </span>
    ),
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
              onClick={() =>
                onDelete(
                  feature.id,
                  getFeatureItems(feature)[0]?.title ?? 'this announcement',
                )
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
