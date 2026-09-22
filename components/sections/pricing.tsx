import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { pricingPackages } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="section-pad scroll-mt-20 border-b hairline bg-paper-soft">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">Packages</p>
          <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
            Clear starting points, scoped to what you actually need.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] lg:grid-cols-3">
          {pricingPackages.map((pkg, i) => (
            <Reveal key={pkg.slug} delay={i * 0.06}>
              <div className="flex h-full flex-col bg-paper p-8 md:p-9">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-signal-500">
                  {pkg.tagline}
                </p>
                <h3 className="mt-4 text-[26px] text-ink-900 [font-family:var(--font-display)]">
                  {pkg.name}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-500">
                  {pkg.audience}
                </p>
                <p className="mt-6 text-[17px] text-ink-900">{pkg.priceLabel}</p>

                <ul className="mt-7 flex flex-1 flex-col gap-2.5 border-t hairline pt-7">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-[14px] text-ink-600"
                    >
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-signal-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  href="/contact"
                  variant={i === 1 ? "primary" : "secondary"}
                  className="mt-9 w-full"
                >
                  Discuss Your Project
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 max-w-xl text-[14px] leading-relaxed text-ink-400">
            Every project is quoted after we understand the scope. These are
            starting points, not fixed prices — the conversation matters more
            than the package.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
