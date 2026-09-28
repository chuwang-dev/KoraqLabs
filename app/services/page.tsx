import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Business websites, landing pages, website redesigns, and hosting & deployment for Nigerian businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-ink-900/10 section-pad !pb-14">
        <div className="container-page">
          <h1 className="max-w-2xl font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            Websites and landing pages built for how your business actually
            operates.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500">
            We currently focus on four services — each one aimed at helping
            Nigerian businesses look credible online and reach more customers.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page space-y-16">
          {services.map((service) => (
            <div
              key={service.slug}
              id={service.slug}
              className="scroll-mt-[100px] grid gap-8 border-b border-ink-900/10 pb-16 last:border-b-0 last:pb-0 md:grid-cols-[1fr_1.4fr]"
            >
              <div>
                <h2 className="font-display text-2xl text-ink-900">
                  {service.title}
                </h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
                  {service.description}
                </p>
                <CtaButton href="/contact" variant="secondary" className="mt-6">
                  Talk to Us
                </CtaButton>
              </div>

              <ul className="grid gap-3 self-start sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-md border border-ink-900/10 px-4 py-3 text-[14px] text-ink-700"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-signal-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
