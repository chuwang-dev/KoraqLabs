import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.services.seoTitle,
    description: content.pages.services.seoDescription,
  };
}

export default async function ServicesPage() {
  const { content } = await getSiteContent();
  const page = content.pages.services;

  return (
    <>
      <section className="border-b border-ink-900/10 section-pad !pb-14">
        <div className="container-page">
          <h1 className="max-w-2xl font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500">
            {page.description}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page space-y-16">
          {content.collections.services.map((service) => (
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
                <CtaButton href={page.ctaHref} variant="secondary" className="mt-6">
                  {page.ctaLabel}
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
