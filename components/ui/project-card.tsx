"use client";

import Link from "next/link";
import { ProjectPreview } from "@/components/ui/project-preview";
import { StatusBadge } from "@/components/ui/status-badge";
import { IconArrowUpRight } from "@/components/ui/icons";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data";

export function ProjectCard({
  project,
  featured,
  priority,
}: {
  project: Project;
  featured?: boolean;
  priority?: boolean;
}) {
  return (
    <article className={cn("group flex flex-col", featured && "lg:flex-row lg:gap-10")}>
      <Link
        href={`/work/${project.slug}`}
        onClick={() => trackEvent("portfolio_click", { project: project.slug })}
        className={cn("block overflow-hidden rounded-md", featured && "lg:w-[58%]")}
        aria-label={`View ${project.name} project`}
      >
        <ProjectPreview project={project} priority={priority} />
      </Link>

      <div className={cn("flex flex-col pt-6", featured && "lg:w-[42%] lg:justify-center lg:pt-0")}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">
            {project.industry}
          </span>
        </div>

        <h3
          className={cn(
            "mt-4 text-ink-900 [font-family:var(--font-display)]",
            featured ? "text-[32px] leading-tight" : "text-[24px] leading-tight"
          )}
        >
          {project.name}
        </h3>

        <p className="mt-1.5 text-[14px] text-ink-400">{project.type}</p>

        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-500">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded border hairline px-2.5 py-1 font-mono text-[11px] text-ink-500"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-5">
          <Link
            href={`/work/${project.slug}`}
            onClick={() => trackEvent("portfolio_click", { project: project.slug })}
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-900 hover:text-signal-600"
          >
            View project
            <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] text-ink-400 hover:text-ink-900"
            >
              Visit live site
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
