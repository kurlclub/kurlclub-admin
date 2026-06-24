/**
 * Tiny dependency-free chart primitives for the prototype demo (no chart
 * library). Pure CSS/SVG. Swap for a real charting lib when wiring data.
 */

const ACCENT = '#d3f702';

/** Vertical bar chart from a numeric series. */
export function BarChartMini({
  data,
  color = ACCENT,
  height = 180,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(1, ...data);
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: color,
            opacity: 0.35 + (v / max) * 0.65,
          }}
          title={String(v)}
        />
      ))}
    </div>
  );
}

/** Sparkline-style line chart (SVG) for trends. */
export function SparklineMini({
  data,
  color = ACCENT,
  height = 56,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** Horizontal labelled bars — for plan mix, funnels, top performers. */
export function HBarList({
  items,
  color = ACCENT,
}: {
  items: { label: string; value: number; display?: string; sub?: string }[];
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-secondary-blue-100">{item.label}</span>
            <span className="text-white">{item.display ?? item.value}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary-blue-700">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: color,
                opacity: 0.85,
              }}
            />
          </div>
          {item.sub && (
            <p className="mt-1 text-xs text-secondary-blue-300">{item.sub}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
