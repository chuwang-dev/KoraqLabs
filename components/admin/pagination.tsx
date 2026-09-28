import Link from "next/link";

export function Pagination({
  basePath,
  page,
  pageCount,
  extraParams = {},
}: {
  basePath: string;
  page: number;
  pageCount: number;
  extraParams?: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams();
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  const linkClass =
    "rounded border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-900/5";
  const disabledClass = "rounded border border-ink-900/10 px-3 py-1.5 text-xs text-ink-300 opacity-50";

  return (
    <div className="flex items-center justify-between pt-2">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass}>
          ← Previous
        </Link>
      ) : (
        <span className={disabledClass}>← Previous</span>
      )}
      <span className="text-xs text-ink-500">
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={href(page + 1)} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </div>
  );
}
