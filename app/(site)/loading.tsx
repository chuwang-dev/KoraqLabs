export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-ink-900/15 border-t-ink-900" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
