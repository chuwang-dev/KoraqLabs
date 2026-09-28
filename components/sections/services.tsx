import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { services, supportServices } from "@/lib/data";
import { IconArrowUpRight } from "@/components/ui/icons";

export function Services() {
  return (
    <section id="services" className="section-pad scroll-mt-20 border-b hairline">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">What we build</p>
          <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
            Four ways we help businesses show up and operate online.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.06}>
              <Link
                href={`/services#${service.slug}`}
                className="group flex h-full flex-col bg-paper p-8 transition-colors duration-300 hover:bg-paper-soft md:p-10"
              >
                <span className="font-mono text-[11px] text-signal-500">
                  {service.index}
                </span>
                <h3 className="mt-5 text-[22px] leading-snug text-ink-900 [font-family:var(--font-display)]">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-500">
                  {service.summary}
                </p>
                <span className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-900">
                  Explore service
                  <IconArrowUpRight className="h-3.5 w-3.5 text-signal-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 rounded-lg border hairline bg-paper-soft p-8 md:p-10">
            <p className="eyebrow">Also included when a project needs it</p>
            <ul className="mt-7 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {supportServices.map((item) => (
                <li key={item.title}>
                  <p className="text-[15px] font-medium text-ink-900">{item.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink-500">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
