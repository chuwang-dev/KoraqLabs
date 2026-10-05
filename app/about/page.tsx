import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.about.seoTitle,
    description: content.pages.about.seoDescription,
  };
}

export default async function AboutPage() {
  const { content } = await getSiteContent();
  const page = content.pages.about;

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

      <section className="section-pad border-b border-ink-900/10">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              {page.startingTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              {page.startingDescription}
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              {page.futureTitle}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              {page.futureDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-display text-2xl text-ink-900">{page.approachTitle}</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {content.collections.whyPoints.map((point) => (
              <div key={point.title}>
                <h3 className="font-display text-lg text-ink-900">
                  {point.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
          <CtaButton href={page.ctaHref} className="mt-12">
            {page.ctaLabel}
          </CtaButton>
        </div>
      </section>
    </>
  );
}
