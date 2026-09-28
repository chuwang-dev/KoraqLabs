import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Technology } from "@/components/sections/technology";
import { Process } from "@/components/sections/process";
import { services, supportServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business websites, landing pages, web applications, and website redesign for Nigerian businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we build, and what it takes to get it live."
        description="Four core services, plus the operational work that keeps a project running after launch."
      >
        <Button href="/contact" size="lg">Start a Project</Button>
      </PageHeader>

      <section className="section-pad border-b hairline">
        <div className="container-page space-y-24">
          {services.map((service) => (
            <Reveal key={service.slug}>
              <div
                id={service.slug}
                className="scroll-mt-24 grid gap-10 border-b hairline pb-24 last:border-b-0 last:pb-0 lg:grid-cols-[0.9fr_1.1fr]"
              >
                <div>
                  <span className="font-mono text-[11px] text-signal-500">{service.index}</span>
                  <h2 className="mt-4 text-[30px] leading-tight text-ink-900 [font-family:var(--font-display)]">
                    {service.title}
                  </h2>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-500">
                    {service.description}
                  </p>
                  <Button href="/contact" variant="secondary" className="mt-8">
                    Discuss this service
                  </Button>
                </div>

                <ul className="grid gap-px self-start overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] sm:grid-cols-2">
                  {service.deliverables.map((item) => (
                    <li key={item} className="bg-paper px-5 py-4 text-[14px] text-ink-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad border-b hairline bg-paper-soft">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Supporting services</p>
            <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
              The work that happens around the build.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {supportServices.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="border-t hairline pt-5">
                  <h3 className="text-[17px] text-ink-900 [font-family:var(--font-display)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-500">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <Technology />
    </>
  );
}
