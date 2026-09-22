import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/ui/project-card";
import { BrochureCta } from "@/components/sections/brochure-cta";
import { liveProjects, demoProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Websites and digital products designed and built by Koraq Labs, including live client projects and demo concepts.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our work"
        title="Projects we've shipped, and concepts we've explored."
        description="Live client work is labelled as such. Everything else is a self-initiated concept — we don't present demos as clients."
      />

      <section className="section-pad border-b hairline">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Live projects</p>
          </Reveal>

          <div className="mt-14 space-y-20">
            {liveProjects.map((project, i) => (
              <Reveal key={project.slug}>
                <ProjectCard project={project} featured priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b hairline bg-paper-soft">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Demo concepts</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500">
              Self-initiated concepts exploring how different industries might
              structure their websites. These are not client projects.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {demoProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.06}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BrochureCta />
    </>
  );
}
