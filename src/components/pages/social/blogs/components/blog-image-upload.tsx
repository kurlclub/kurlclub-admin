'use client';

import { useRef } from 'react';

import { ImageIcon, X } from 'lucide-react';

import { Button, Spinner } from '@kurlclub/ui-components';

import { useUploadBlogImage } from '@/services/social/blogs';
import type { BlogCoverImage } from '@/types/blog';

interface BlogImageUploadProps {
  value: BlogCoverImage;
  onChange: (value: BlogCoverImage) => void;
  error?: string;
}

export function BlogImageUpload({ value, onChange, error }: BlogImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadBlogImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { src } = await uploadMutation.mutateAsync(file);
    onChange({ src, alt: value.alt || file.name.replace(/\.[^.]+$/, '') });
    // Reset so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClear = () => {
    onChange({ src: '', alt: '' });
  };

  return (
    <div className="space-y-2">
      {value.src ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.src}
            alt={value.alt}
            className="h-40 w-full rounded-lg object-cover"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70"
            onClick={handleClear}
          >
            <X className="h-3 w-3 text-white" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-secondary-blue-700 text-secondary-blue-300 hover:border-secondary-blue-500 hover:text-secondary-blue-200 transition-colors disabled:opacity-50"
        >
          {uploadMutation.isPending ? (
            <Spinner />
          ) : (
            <>
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">Click to upload cover image</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {value.src && (
        <input
          type="text"
          placeholder="Image alt text"
          value={value.alt}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className="w-full rounded border border-secondary-blue-700 bg-secondary-blue-900 px-3 py-1.5 text-sm text-white placeholder-secondary-blue-400 focus:outline-none focus:ring-1 focus:ring-white"
        />
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
