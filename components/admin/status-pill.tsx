const COLORS: Record<string, string> = {
  new: "bg-azure-500/10 text-azure-600 border-azure-500/25",
  contacted: "bg-signal-500/10 text-signal-600 border-signal-500/25",
  qualified: "bg-signal-500/15 text-signal-700 border-signal-500/30",
  proposal_sent: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  won: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
  lost: "bg-ink-900/5 text-ink-400 border-ink-900/10",
  planning: "bg-ink-900/5 text-ink-500 border-ink-900/10",
  design: "bg-azure-500/10 text-azure-600 border-azure-500/25",
  development: "bg-signal-500/10 text-signal-600 border-signal-500/25",
  review: "bg-amber-500/10 text-amber-700 border-amber-500/25",
  live: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
};

function formatLabel(status: string) {
  return status
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusPill({ status }: { status: string }) {
  const classes = COLORS[status] ?? "bg-ink-900/5 text-ink-500 border-ink-900/10";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {formatLabel(status)}
    </span>
  );
}
