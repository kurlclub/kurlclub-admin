'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { FeatureItem } from '@/types/feature-announcement';

interface FeaturePreviewProps {
  features: Array<Partial<FeatureItem>>;
}

const slideHasContent = (f: Partial<FeatureItem>): boolean =>
  !!(f.src || f.tag || f.title || f.description);

/**
 * Mirrors the in-app "Update modal" shown to users: an image banner with
 * pagination dots, a tag / title / description caption, and prev/next controls.
 * Each feature in the array is one slide of the carousel.
 */
export function FeaturePreview({ features }: FeaturePreviewProps) {
  const slides = features.length ? features : [{}];
  // `current` may briefly exceed the range when slides are removed; it's clamped
  // at render via `activeIndex`, and navigation wraps with modulo, so it
  // self-corrects without an effect.
  const [current, setCurrent] = useState(0);

  if (!features.some(slideHasContent)) {
    return (
      <div className="mx-auto flex h-64 max-w-[542px] items-center justify-center rounded-2xl border border-secondary-blue-700 bg-secondary-blue-800">
        <p className="text-sm italic text-secondary-blue-400">
          Start filling in the form to see a preview.
        </p>
      </div>
    );
  }

  const activeIndex = Math.min(current, slides.length - 1);
  const { src, tag, title, description } = slides[activeIndex] ?? {};
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === slides.length - 1;

  const go = (dir: -1 | 1) =>
    setCurrent((c) =>
      Math.min(
        Math.max(Math.min(c, slides.length - 1) + dir, 0),
        slides.length - 1,
      ),
    );

  return (
    <div className="mx-auto max-w-[542px] overflow-hidden rounded-2xl border border-secondary-blue-700 bg-secondary-blue-800">
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

        {/* Decorative close button — mirrors the live modal */}
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-secondary-blue-900/60 text-secondary-blue-100">
          <X className="h-4 w-4" />
        </span>

        {/* Pagination dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={
                i === activeIndex
                  ? 'h-1.5 w-5 rounded-full bg-white transition-all'
                  : 'h-1.5 w-1.5 rounded-full bg-white/40 transition-all hover:bg-white/60'
              }
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="relative bg-background-dark p-6">
        <div className="min-h-[96px] pr-24">
          {tag && (
            <span className="text-[13px] font-semibold text-primary-green-500">
              {tag}
            </span>
          )}
          {title && (
            <h2 className="mt-2 text-[24px] font-bold leading-[109%] text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-3 text-[15px] font-normal leading-relaxed text-secondary-blue-100">
              {description}
            </p>
          )}
        </div>

        {/* Prev / next controls */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={isFirst}
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-blue-700 text-white transition-colors hover:bg-secondary-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={isLast}
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-blue-700 text-white transition-colors hover:bg-secondary-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
