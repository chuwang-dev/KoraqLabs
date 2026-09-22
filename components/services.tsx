import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/data";
import { IconLayout, IconTarget, IconRefresh, IconServer, IconArrowUpRight } from "@/components/icons";

const icons = [IconLayout, IconTarget, IconRefresh, IconServer];

export function Services() {
  return (
    <section className="section-pad border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading
          title="What We Build"
          supporting="From a simple landing page to a complete business website, we build digital experiences designed around your customers."
        />

        <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2">
          {services.map((service, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={service.slug} className="bg-paper p-8">
                <Icon className="h-6 w-6 text-signal-600" />
                <h3 className="mt-5 font-display text-xl text-ink-900">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
                  {service.summary}
                </p>
                <Link
                  href={`/services#${service.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-[14px] font-medium text-ink-900 hover:text-signal-600"
                >
                  Learn more
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
