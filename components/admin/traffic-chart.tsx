type Point = { date: string; visitors: number; pageViews: number };

export function TrafficChart({ series }: { series: Point[] }) {
  if (series.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded border border-dashed border-ink-900/15 text-sm text-ink-400">
        No traffic data for this period yet.
      </div>
    );
  }

  const width = 720;
  const height = 220;
  const padding = 24;
  const maxValue = Math.max(1, ...series.map((d) => Math.max(d.visitors, d.pageViews)));

  const toPoints = (key: "visitors" | "pageViews") =>
    series
      .map((d, i) => {
        const x = padding + (i / Math.max(series.length - 1, 1)) * (width - padding * 2);
        const y = height - padding - (d[key] / maxValue) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full min-w-[560px]"
        role="img"
        aria-label="Visitors and page views over time"
      >
        {/* baseline */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="currentColor"
          className="text-ink-900/10"
          strokeWidth={1}
        />
        <polyline
          points={toPoints("pageViews")}
          fill="none"
          className="text-azure-400"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
        <polyline
          points={toPoints("visitors")}
          fill="none"
          className="text-signal-500"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-2 flex items-center gap-5 text-xs text-ink-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-signal-500" /> Visitors
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-azure-400/70" /> Page views
        </span>
      </div>
    </div>
  );
}
