'use client';

import type { FeatureItem } from '@/types/feature-announcement';

interface FeaturePreviewProps {
  data: Partial<FeatureItem>;
}

/**
 * Mirrors the announcement slide rendered by the public
 * FeatureAnnouncementModal (image banner + tag / title / description).
 */
export function FeaturePreview({ data }: FeaturePreviewProps) {
  const { src, tag, title, description } = data;

  const hasContent = src || tag || title || description;

  if (!hasContent) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm italic text-secondary-blue-400">
          Start filling in the form to see a preview.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[542px] overflow-hidden rounded-2xl border border-secondary-blue-600 bg-secondary-blue-800">
      {/* Image banner */}
      <div className="relative h-[275px] w-full overflow-hidden bg-secondary-blue-600">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={title || 'Feature'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-secondary-blue-300">
            Image preview
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="flex flex-col gap-2 p-4 pb-5">
        {tag && (
          <span className="text-[13px] font-semibold text-primary-green-500">
            {tag}
          </span>
        )}
        {title && (
          <h2 className="text-[24px] font-bold leading-[109%] text-primary-blue-50">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-2 text-[15px] font-normal leading-relaxed text-primary-blue-100">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
