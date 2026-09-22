import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "@/components/ui/project-preview";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProjectCard } from "@/components/ui/project-card";
import { IconArrowUpRight } from "@/components/ui/icons";
import { projects } from "@/lib/data";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

export default function ProjectPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <>
      <section className="border-b hairline">
        <div className="container-page py-14 md:py-20">
          <Reveal>
            <Link href="/work" className="text-[14px] text-ink-400 hover:text-ink-900">
              ← Back to work
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <StatusBadge status={project.status} />
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400">
                {project.industry} · {project.type}
              </span>
            </div>

            <h1 className="mt-6 text-display-lg [font-family:var(--font-display)]">
              {project.name}
            </h1>

            <p className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-ink-500">
              {project.longDescription}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {project.liveUrl ? (
                <Button href={project.liveUrl} external size="lg">
                  Visit live site
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              ) : null}
              <Button href="/contact" variant={project.liveUrl ? "secondary" : "primary"} size="lg">
                Start a similar project
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b hairline bg-paper-soft py-14 md:py-20">
        <div className="container-page">
          <Reveal>
            <ProjectPreview project={project} priority className="shadow-[0_24px_60px_-30px_rgba(12,13,15,0.3)]" />
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-b hairline">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div>
              <p className="eyebrow">What it does</p>
              <ul className="mt-6 space-y-4">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3 text-[16px] leading-relaxed text-ink-600">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-signal-400" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <p className="eyebrow">Built with</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded border hairline bg-paper-soft px-3 py-1.5 font-mono text-[12px] text-ink-600"
                  >
                    {tech}
                  </li>
                ))}
              </ul>

              {project.status === "demo" ? (
                <p className="mt-8 rounded-md border border-dashed border-ink-900/15 bg-paper-soft px-5 py-4 text-[14px] leading-relaxed text-ink-500">
                  This is a self-initiated demo concept, not a live client
                  project. It exists to show how we&apos;d approach this kind of
                  business.
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">More work</p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {others.map((other, i) => (
              <Reveal key={other.slug} delay={i * 0.06}>
                <ProjectCard project={other} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
