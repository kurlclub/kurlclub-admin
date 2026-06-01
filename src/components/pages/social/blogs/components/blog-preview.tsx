'use client';

import { format, parseISO } from 'date-fns';

import type { BlogFormData } from '@/types/blog';

// ── Inlined from landing site: src/icon/icon.tsx ─────────────────────────────
const QuotaIcon = () => (
  <svg
    width="55"
    height="55"
    viewBox="0 0 55 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36.3871 14L37.5484 16.8064C34.0645 17.9032 31.4194 19.4194 29.6129 21.3548C27.8065 23.2258 26.9032 25.2258 26.9032 27.3548C26.9032 28.8387 27.4516 29.5806 28.5484 29.5806C29.2581 29.5806 30 29.4194 30.7742 29.0968C31.6129 28.7742 32.5806 28.6129 33.6774 28.6129C35.6129 28.6129 37.1613 29.2581 38.3226 30.5484C39.5484 31.7742 40.1613 33.3548 40.1613 35.2903C40.1613 37.4839 39.3871 39.2581 37.8387 40.6129C36.3548 41.9677 34.3871 42.6452 31.9355 42.6452C29.0968 42.6452 26.8387 41.6129 25.1613 39.5484C23.5484 37.4194 22.7419 34.5484 22.7419 30.9355C22.7419 26.6774 23.9032 23.129 26.2258 20.2903C28.5484 17.4516 31.9355 15.3548 36.3871 14ZM13.7419 14L14.8065 16.8064C11.3871 17.9032 8.74193 19.4194 6.87097 21.3548C5.06452 23.2258 4.16129 25.2258 4.16129 27.3548C4.16129 28.8387 4.74194 29.5806 5.90323 29.5806C6.54839 29.5806 7.29032 29.4194 8.12903 29.0968C8.96774 28.7742 9.90323 28.6129 10.9355 28.6129C12.9355 28.6129 14.5161 29.2581 15.6774 30.5484C16.9032 31.7742 17.5161 33.3548 17.5161 35.2903C17.5161 37.4839 16.7419 39.2581 15.1935 40.6129C13.7097 41.9677 11.7419 42.6452 9.29032 42.6452C6.45161 42.6452 4.19355 41.6129 2.51613 39.5484C0.838709 37.4194 0 34.5484 0 30.9355C0 26.6774 1.16129 23.129 3.48387 20.2903C5.80645 17.4516 9.22581 15.3548 13.7419 14Z"
      fill="#F1FDB1"
    />
  </svg>
);

// ── Inlined from landing site: src/components/shared/avatar.tsx ──────────────
const BlogAvatar = ({
  name,
  size = 24,
}: {
  name?: string;
  size?: number;
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';
  return (
    <div
      className="flex items-center justify-center rounded-full bg-secondary-blue-400 font-medium text-white"
      style={{ width: size, height: size, fontSize: 12 }}
    >
      {initials}
    </div>
  );
};

// ── Preview ───────────────────────────────────────────────────────────────────

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
      <div className="flex h-64 items-center justify-center">
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
      {/* ── BlogTitle ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {title && (
          <h1 className="text-[26px] font-medium leading-[109%]">{title}</h1>
        )}

        {(formattedDate || author?.name) && (
          <div className="flex flex-wrap items-center gap-2">
            {formattedDate && (
              <span className="border-r border-white/40 pr-3.5 text-[14px] leading-[109%]">
                {formattedDate}
              </span>
            )}
            {author?.name && (
              <div className="flex items-center gap-2">
                <BlogAvatar name={author.name} size={24} />
                <span className="text-[14px] leading-[109%]">
                  {author.name}
                </span>
              </div>
            )}
          </div>
        )}

        {coverImage?.src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.src}
            alt={coverImage.alt || title || 'Cover'}
            className="h-60 w-full rounded-lg object-cover"
          />
        )}
      </div>

      {/* ── BlogDetail ──────────────────────────────────────── */}
      <div className="mt-6 flex flex-col gap-[18px] sm:flex-row">
        {/* Left sidebar */}
        <div className="shrink-0 sm:w-[220px]">
          <div className="flex flex-col gap-4 pt-5">
            <button
              type="button"
              className="flex w-fit cursor-default items-center gap-1 text-sm leading-[109%] text-secondary-blue-300"
            >
              <span className="flex h-5 w-5 rotate-180 items-center justify-center">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#D3F702"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
              See all articles
            </button>

            {title && (
              <span className="text-[18px] font-medium leading-[109%]">
                {title}
              </span>
            )}
          </div>
        </div>

        {/* Right: article body */}
        <div className="flex-1 pt-5">
          <div className="flex flex-col gap-5">
            {mainHeading && (
              <span className="text-[20px] leading-[109%]">{mainHeading}</span>
            )}

            {sections?.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {section.heading && (
                  <span className="text-[20px] leading-[109%]">
                    {section.heading}
                  </span>
                )}

                {section.paragraphs
                  ?.filter((p) => p?.trim())
                  .map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-[14px] leading-relaxed text-secondary-blue-100"
                    >
                      {para}
                    </p>
                  ))}

                {section.quote?.trim() && (
                  <>
                    <span>
                      <QuotaIcon />
                    </span>
                    <p className="text-[15px] font-light italic leading-[109%]">
                      {section.quote}
                    </p>
                  </>
                )}

                <div className="h-px w-full bg-white/20" />
              </div>
            ))}

            {/* Author */}
            {(author?.name || author?.bio) && (
              <div className="flex flex-col gap-3">
                {author.name && (
                  <div className="flex items-center gap-2">
                    <BlogAvatar name={author.name} size={24} />
                    <span className="text-[14px] leading-[109%]">
                      By {author.name}
                    </span>
                  </div>
                )}
                {author.bio && (
                  <p className="text-[14px] leading-relaxed text-secondary-blue-200">
                    {author.bio}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
