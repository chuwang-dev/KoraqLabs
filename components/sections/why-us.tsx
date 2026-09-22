import { Reveal } from "@/components/ui/reveal";
import { valueProps } from "@/lib/data";

// Dark section — used as a deliberate contrast beat in the page rhythm.

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-ink-900 text-paper">
      <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]" />

      <div className="container-page section-pad relative">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
            Why Koraq Labs
          </p>
          <h2 className="mt-5 max-w-[18ch] text-display-md text-paper [font-family:var(--font-display)]">
            Not just a website. A digital asset for your business.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-x-10 gap-y-14 sm:grid-cols-2">
          {valueProps.map((prop, i) => (
            <Reveal key={prop.number} delay={i * 0.06}>
              <div className="border-t border-white/10 pt-6">
                <span className="font-mono text-[12px] text-signal-300">
                  {prop.number}
                </span>
                <h3 className="mt-4 text-[22px] text-paper [font-family:var(--font-display)]">
                  {prop.title}
                </h3>
                <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/55">
                  {prop.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
