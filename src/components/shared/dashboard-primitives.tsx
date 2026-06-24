import type { ReactNode } from 'react';

/** Simple KPI tile (matches existing card style). Defaults to an em dash until
 * data is wired. */
export function StatTile({
  label,
  value = '—',
  hint,
}: {
  label: string;
  value?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
      <p className="text-xs uppercase tracking-wide text-secondary-blue-300">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-secondary-blue-300">{hint}</p>}
    </div>
  );
}

/** A titled panel with a dashed "chart pending data" placeholder. Charts are
 * intentionally deferred until the backend and a chart library are decided. */
export function ChartPlaceholder({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6 ${className ?? ''}`}
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary-blue-200">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-secondary-blue-300">
            {description}
          </p>
        )}
      </div>
      <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-secondary-blue-400 text-sm text-secondary-blue-300">
        Chart will appear here once the backend is connected.
      </div>
    </section>
  );
}
