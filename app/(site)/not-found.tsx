import Link from "next/link";
import { CtaButton } from "@/components/cta-button";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-page max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-5 font-display text-4xl text-ink-900">
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-ink-500">
          The link may be outdated, or the page may have moved. Everything else
          is still where you left it.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <CtaButton href="/">Back to home</CtaButton>
          <Link href="/work" className="rounded border border-ink-900/15 px-5 py-3 text-sm font-medium text-ink-900">View our work</Link>
        </div>
      </div>
    </section>
  );
}
