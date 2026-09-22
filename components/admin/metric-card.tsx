export function MetricCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-3xl italic text-ink-900">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-ink-400">{sublabel}</p> : null}
    </div>
  );
}
