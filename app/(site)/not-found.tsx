import Link from "next/link";
import { CtaButton } from "@/components/cta-button";
import { getSiteContent } from "@/lib/site-content";

export default async function NotFound() {
  const { content } = await getSiteContent();
  const page = content.pages.notFound;

  return (
    <section className="section-pad">
      <div className="container-page max-w-xl">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 className="mt-5 font-display text-4xl text-ink-900">
          {page.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink-500">
          {page.description}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CtaButton href={page.homeHref}>{page.homeLabel}</CtaButton>
          <Link href={page.workHref} className="rounded border border-ink-900/15 px-5 py-3 text-sm font-medium text-ink-900">{page.workLabel}</Link>
        </div>
      </div>
    </section>
  );
}
