export function BreakdownList({
  items,
}: {
  items: { label: string; visitors: number; percentage: number }[];
}) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-400">No data yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-800">{item.label}</span>
            <span className="text-ink-500">
              {item.visitors.toLocaleString()} · {item.percentage}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
            <div className="h-full rounded-full bg-azure-400" style={{ width: `${item.percentage}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
