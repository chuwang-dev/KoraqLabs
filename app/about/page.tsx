import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/cta-button";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description:
      "Learn how Koraq Labs helps Nigerian businesses build credible websites, stronger brands, and better customer experiences.",
  };
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-900/10 section-pad">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#C8A2C8]/50 bg-[#F7EDF6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B3A5A]">
              About Koraq Labs
            </p>
            <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.1] text-ink-900 md:text-5xl lg:text-[4rem]">
              We design digital experiences that help businesses look credible and win attention.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-500">
              Koraq Labs helps ambitious businesses clarify their message, sharpen their online presence, and turn that presence into more leads, more trust, and more momentum.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaButton href="/contact">Start a Project</CtaButton>
              <a href="/work" className="text-sm font-semibold text-ink-900 underline-offset-4 transition hover:text-[#5B3A5A] hover:underline">
                View our work
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-[#DCC7D5] bg-[#F4EAE2] p-3 shadow-[0_28px_70px_rgba(30,17,40,0.08)]">
              <Image
                src="/images/chuwang-portrait.svg"
                alt="Portrait of Chuwang Emmanuel, founder of Koraq Labs"
                width={720}
                height={820}
                className="h-[560px] w-full rounded-[22px] object-cover md:h-[620px]"
                priority
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-full border border-[#DCC7D5] bg-white/90 px-4 py-2 text-sm font-medium text-ink-900 shadow-md backdrop-blur">
              Founder • Chuwang Emmanuel
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-ink-900/10">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B3A5A]">Our story</p>
            <h2 className="mt-4 font-display text-3xl text-ink-900 md:text-4xl">
              Built around clarity, craft, and business growth.
            </h2>
          </div>

          <div className="space-y-5 text-[15px] leading-relaxed text-ink-500">
            <p>
              Koraq Labs started with a simple problem: many small and growing businesses were still trying to compete online with weak websites, outdated positioning, and poor customer journeys.
            </p>
            <p>
              We believe a website should do more than look impressive. It should make a business easier to trust, easier to contact, and easier to grow.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B3A5A]">What we do</p>
            <h2 className="mt-4 font-display text-3xl text-ink-900 md:text-4xl">
              We help businesses turn online presence into commercial momentum.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Strategy",
                description:
                  "We translate business goals into a clear digital direction, so every page and call-to-action has a purpose.",
              },
              {
                title: "Design",
                description:
                  "We create polished, conversion-focused interfaces that feel premium and communicate trust instantly.",
              },
              {
                title: "Development",
                description:
                  "We build clean, fast, modern websites that load quickly and work beautifully across devices.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-[0_14px_35px_rgba(30,17,40,0.05)]">
                <h3 className="font-display text-2xl text-ink-900">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <CtaButton href="/contact">Talk to us</CtaButton>
          </div>
        </div>
      </section>
    </>
  );
}
