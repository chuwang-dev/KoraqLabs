import { CtaButton } from "@/components/cta-button";
import { BrowserMockup } from "@/components/browser-mockup";

export function Hero() {
  return (
    <section className="border-b border-[#C8A2C8]/30 bg-[#F8F1F8]">
      <div className="container-page grid items-center gap-14 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
        <div className="fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C8A2C8]/60 bg-[#F3E7F3] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-800">
            <span className="h-2 w-2 rounded-full bg-[#C8A2C8]" />
            Koraq Labs
          </div>
          <h1 className="font-display text-[2.5rem] leading-[1.08] text-ink-900 sm:text-5xl md:text-[3.25rem]">
            We build websites that help Nigerian businesses get customers and
            scale effectively.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-500">
            We design and build fast, modern websites and landing pages that
            help Nigerian businesses look credible, reach more customers, and
            grow online.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <CtaButton href="/contact">Start a Project</CtaButton>
            <CtaButton href="/work" variant="secondary">
              View Our Work
            </CtaButton>
          </div>
        </div>

        <div className="relative hidden md:block" aria-hidden="true">
          <div className="absolute -inset-6 -z-10 rounded-lg bg-[#F0E2F0]" />
          <div className="flex flex-col gap-5">
            <BrowserMockup label="Business website" accent className="translate-x-6" />
            <BrowserMockup label="Landing page" className="-translate-x-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
