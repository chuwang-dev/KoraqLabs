import { SectionHeading } from "@/components/section-heading";
import { CtaButton } from "@/components/cta-button";
import type { SiteContent } from "@/lib/site-content";

export function Process({ content }: { content: SiteContent }) {
  const section = content.home.process;
  if (!section.enabled) return null;

  return (
    <section id="process" className="section-pad scroll-mt-[65px] border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading title={section.title} />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {content.collections.processSteps.map((step, i) => (
            <div key={step.number} className="relative pl-0">
              <span className="font-display text-3xl text-ink-900/20">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-lg text-ink-900">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                {step.description}
              </p>
              {i < content.collections.processSteps.length - 1 ? (
                <span className="mt-6 hidden h-px w-full bg-ink-900/10 sm:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-14">
          <CtaButton href={section.ctaHref}>{section.ctaLabel}</CtaButton>
        </div>
      </div>
    </section>
  );
}
