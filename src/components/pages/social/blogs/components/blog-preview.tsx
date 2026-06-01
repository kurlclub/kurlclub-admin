'use client';

import { format, parseISO } from 'date-fns';

import type { BlogFormData } from '@/types/blog';

interface BlogPreviewProps {
  data: Partial<BlogFormData>;
}

export function BlogPreview({ data }: BlogPreviewProps) {
  const { title, displayDate, author, coverImage, mainHeading, sections } =
    data;

  const hasContent =
    title ||
    mainHeading ||
    coverImage?.src ||
    sections?.some((s) => s.paragraphs?.some(Boolean));

  if (!hasContent) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm italic text-secondary-blue-400">
          Start filling in the form to see a preview.
        </p>
      </div>
    );
  }

  let formattedDate = '';
  if (displayDate) {
    try {
      const d = parseISO(
        displayDate.length === 10 ? `${displayDate}T00:00:00` : displayDate,
      );
      formattedDate = format(d, 'MMM dd, yyyy');
    } catch {
      formattedDate = displayDate;
    }
  }

  return (
    <div className="text-white">
      {/* Title */}
      {title && (
        <h1 className="mb-4 text-2xl font-medium leading-tight md:text-3xl">
          {title}
        </h1>
      )}

      {/* Meta: date · author */}
      {(formattedDate || author?.name) && (
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-secondary-blue-200">
          {formattedDate && (
            <span className="border-r border-secondary-blue-600 pr-3">
              {formattedDate}
            </span>
          )}
          {author?.name && (
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-blue-600 text-xs font-medium">
                {author.name.charAt(0).toUpperCase()}
              </span>
              <span>{author.name}</span>
            </div>
          )}
        </div>
      )}

      {/* Cover image */}
      {coverImage?.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage.src}
          alt={coverImage.alt || title || 'Cover image'}
          className="mb-6 h-48 w-full rounded-lg object-cover"
        />
      )}

      {/* Main heading */}
      {mainHeading && (
        <h2 className="mb-5 text-xl font-medium leading-snug">{mainHeading}</h2>
      )}

      {/* Sections */}
      {sections?.map((section, idx) => (
        <div key={idx} className="mb-5">
          {section.heading && (
            <h3 className="mb-3 text-lg font-medium">{section.heading}</h3>
          )}

          {section.paragraphs
            ?.filter((p) => p?.trim())
            .map((para, pIdx) => (
              <p
                key={pIdx}
                className="mb-3 text-sm leading-relaxed text-secondary-blue-100"
              >
                {para}
              </p>
            ))}

          {section.quote?.trim() && (
            <blockquote className="my-4 border-l-2 border-secondary-blue-400 pl-4">
              <p className="text-base font-light italic text-secondary-blue-200">
                {section.quote}
              </p>
            </blockquote>
          )}

          <div className="mt-4 h-px w-full bg-white/10" />
        </div>
      ))}

      {/* Author bio */}
      {(author?.name || author?.bio) && (
        <div className="mt-6 border-t border-secondary-blue-800 pt-4">
          {author.name && (
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary-blue-600 text-xs font-medium">
                {author.name.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm">By {author.name}</span>
            </div>
          )}
          {author.bio && (
            <p className="text-sm text-secondary-blue-300">{author.bio}</p>
          )}
        </div>
      )}
    </div>
  );
}
