export function DemoDataBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-amber-700">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Demo data — connect DATABASE_URL for real numbers
    </span>
  );
}
