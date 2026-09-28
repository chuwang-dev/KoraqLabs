export function ConversionFunnel({ stages }: { stages: { label: string; value: number }[] }) {
  const max = Math.max(1, ...stages.map((s) => s.value));

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const widthPct = Math.max(4, Math.round((stage.value / max) * 100));
        const prev = i > 0 ? stages[i - 1].value : null;
        const dropPct = prev && prev > 0 ? Math.round((stage.value / prev) * 100) : null;

        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-ink-800">{stage.label}</span>
              <span className="text-ink-500">
                {stage.value.toLocaleString()}
                {dropPct !== null ? <span className="ml-1.5 text-xs text-ink-400">({dropPct}%)</span> : null}
              </span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded bg-ink-900/5">
              <div
                className="h-full rounded bg-signal-500/80 transition-all"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
