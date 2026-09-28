import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section-pad">
      <div className="container-page max-w-xl">
        <p className="eyebrow">404</p>
        <h1 className="mt-5 text-display-md [font-family:var(--font-display)]">
          That page doesn&apos;t exist.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink-500">
          The link may be outdated, or the page may have moved. Everything else
          is still where you left it.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="/">Back to home</Button>
          <Button href="/work" variant="secondary">View our work</Button>
        </div>
      </div>
    </section>
  );
}
