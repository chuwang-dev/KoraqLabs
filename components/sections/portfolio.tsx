import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ui/project-card";
import { liveProjects, demoProjects } from "@/lib/data";

export function Portfolio() {
  return (
    <section id="work" className="section-pad scroll-mt-20 border-b hairline">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">Our work</p>
          <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
            Projects we&apos;ve shipped, and concepts we&apos;ve explored.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-20">
          {liveProjects.map((project, i) => (
            <Reveal key={project.slug}>
              <ProjectCard project={project} featured priority={i === 0} />
            </Reveal>
          ))}
        </div>

        <div className="mt-24 border-t hairline pt-14">
          <Reveal>
            <p className="eyebrow">Demo concepts</p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-500">
              Self-initiated concepts exploring how different industries might
              structure their websites. These are not client projects.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {demoProjects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.06}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-16">
            <Button href="/work" variant="secondary">
              View all work
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
