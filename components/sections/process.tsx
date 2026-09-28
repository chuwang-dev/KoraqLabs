import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { processSteps } from "@/lib/data";

export function Process() {
  return (
    <section id="process" className="section-pad scroll-mt-20 border-b hairline bg-paper-soft">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">How we work</p>
          <h2 className="mt-5 max-w-[18ch] text-display-md [font-family:var(--font-display)]">
            A process that keeps projects moving.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.05}>
              <div className="flex h-full flex-col bg-paper p-7">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] text-signal-500">
                    {step.number}
                  </span>
                  {step.optional ? (
                    <span className="rounded-full border hairline px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-400">
                      Optional
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-[19px] text-ink-900 [font-family:var(--font-display)]">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12">
            <Button href="/contact" size="lg">
              Start Your Project
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
