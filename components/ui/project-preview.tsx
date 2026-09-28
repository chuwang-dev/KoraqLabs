import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";

// Renders the real screenshot when one exists, otherwise falls back to an
// abstract layout block so demo concepts never masquerade as screenshots.

export function ProjectPreview({
  project,
  priority,
  className,
}: {
  project: Project;
  priority?: boolean;
  className?: string;
}) {
  if (project.image) {
    return (
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-md border hairline bg-paper-soft",
          className
        )}
      >
        <Image
          src={project.image}
          alt={`${project.name} website preview`}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-smooth group-hover:scale-[1.03]"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-md border hairline bg-white",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 border-b border-ink-900/[0.07] px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-ink-900/12" />
        <span className="h-2 w-2 rounded-full bg-ink-900/12" />
        <span className="h-2 w-2 rounded-full bg-ink-900/12" />
      </div>
      <div className="space-y-3 p-6">
        <div className="h-2.5 w-1/2 rounded-full bg-ink-900/[0.14]" />
        <div className="h-1.5 w-4/5 rounded-full bg-ink-900/[0.07]" />
        <div className="h-1.5 w-3/5 rounded-full bg-ink-900/[0.07]" />
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="h-12 rounded bg-ink-900/[0.05]" />
          <div className="h-12 rounded bg-ink-900/[0.05]" />
          <div className="h-12 rounded bg-ink-900/[0.05]" />
        </div>
      </div>
    </div>
  );
}
