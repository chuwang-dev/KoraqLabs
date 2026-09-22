import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/data";

// Live client work and demo concepts must always be visually distinguishable.

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const isLive = status === "live";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
        isLive
          ? "bg-signal-50 text-signal-600"
          : "border border-ink-900/12 bg-transparent text-ink-400",
        className
      )}
    >
      {isLive ? <span className="h-1.5 w-1.5 rounded-full bg-signal-500" /> : null}
      {isLive ? "Live project" : "Demo concept"}
    </span>
  );
}
