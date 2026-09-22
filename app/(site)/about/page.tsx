import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { BrochureCta } from "@/components/sections/brochure-cta";
import { GrowthPath } from "@/components/sections/growth-path";
import { company, valueProps } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Koraq Labs is a Nigerian technology studio focused on building practical digital products for businesses.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Koraq Labs"
        title="A Nigerian technology studio building practical digital products."
      >
        <Button href="/contact" size="lg">Start a Project</Button>
      </PageHeader>

      <section className="section-pad border-b hairline">
        <div className="container-page max-w-3xl space-y-6">
          {company.about.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p
                className={
                  i === 0
                    ? "text-[24px] leading-[1.45] text-ink-900 [font-family:var(--font-display)]"
                    : "text-[17px] leading-[1.7] text-ink-500"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad border-b hairline bg-paper-soft">
        <div className="container-page grid gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] md:grid-cols-2">
          <Reveal>
            <div className="h-full bg-paper p-9">
              <p className="eyebrow">Mission</p>
              <p className="mt-4 text-[18px] leading-relaxed text-ink-700">
                {company.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="h-full bg-paper p-9">
              <p className="eyebrow">Vision</p>
              <p className="mt-4 text-[18px] leading-relaxed text-ink-700">
                {company.vision}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad border-b hairline">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Core values</p>
            <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
              How we decide what &ldquo;good&rdquo; means.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {company.values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.05}>
                <div className="border-t hairline pt-6">
                  <h3 className="text-[19px] text-ink-900 [font-family:var(--font-display)]">
                    {value.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b hairline bg-paper-soft">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">How we work</p>
          </Reveal>
          <div className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {valueProps.map((prop, i) => (
              <Reveal key={prop.number} delay={i * 0.05}>
                <div className="border-t hairline pt-6">
                  <span className="font-mono text-[12px] text-signal-500">{prop.number}</span>
                  <h3 className="mt-3.5 text-[20px] text-ink-900 [font-family:var(--font-display)]">
                    {prop.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-[15px] leading-relaxed text-ink-500">
                    {prop.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GrowthPath />
      <BrochureCta />
    </>
  );
}
