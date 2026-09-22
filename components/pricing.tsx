import { SectionHeading } from "@/components/section-heading";
import { CtaButton } from "@/components/cta-button";
import { pricingPackages } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="section-pad scroll-mt-[65px] border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading title="Simple Packages. Clear Pricing." />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pricingPackages.map((pkg) => (
            <div
              key={pkg.slug}
              className="flex flex-col rounded-md border border-ink-900/10 bg-paper p-8"
            >
              <p className="text-[13px] font-medium text-signal-600">
                {pkg.tagline}
              </p>
              <h3 className="mt-1.5 font-display text-2xl text-ink-900">
                {pkg.name}
              </h3>
              <p className="mt-2 text-[15px] text-ink-500">{pkg.audience}</p>
              <p className="mt-6 font-display text-xl text-ink-900">
                {pkg.priceLabel}
              </p>

              <ul className="mt-6 flex flex-col gap-2.5 border-t border-ink-900/10 pt-6">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[14px] text-ink-600">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <CtaButton
                href={pkg.ctaHref}
                variant={pkg.slug === "custom" ? "secondary" : "primary"}
                className="mt-8"
              >
                {pkg.ctaLabel}
              </CtaButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
