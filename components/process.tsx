import { SectionHeading } from "@/components/section-heading";
import { CtaButton } from "@/components/cta-button";
import { processSteps } from "@/lib/data";

export function Process() {
  return (
    <section id="process" className="section-pad scroll-mt-[65px] border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading title="A Simple Process" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {processSteps.map((step, i) => (
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
              {i < processSteps.length - 1 ? (
                <span className="mt-6 hidden h-px w-full bg-ink-900/10 sm:block" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-14">
          <CtaButton href="/contact">Start Your Project</CtaButton>
        </div>
      </div>
    </section>
  );
}
