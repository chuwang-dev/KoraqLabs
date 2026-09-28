import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { whyPoints } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Koraq Labs is a digital product studio helping Nigerian businesses build a professional online presence.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-900/10 section-pad !pb-14">
        <div className="container-page">
          <h1 className="max-w-2xl font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            A digital product studio for Nigerian businesses.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500">
            Koraq Labs helps Nigerian businesses establish a professional
            online presence and acquire customers through high-quality
            websites and landing pages. Today that means websites and landing
            pages — built well, and built to last.
          </p>
        </div>
      </section>

      <section className="section-pad border-b border-ink-900/10">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              Where we&apos;re starting
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              We currently build business websites, landing pages, website
              redesigns, and handle hosting and deployment. Everything we
              build is designed around how Nigerian customers actually search
              for and contact a business.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">
              Where we&apos;re headed
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-500">
              As Koraq Labs grows, our roadmap extends into web applications,
              SaaS products, AI automation, cloud solutions, DevOps, and
              custom software — built on the same foundation of clarity and
              craft we bring to every website today.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page">
          <h2 className="font-display text-2xl text-ink-900">How we work</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {whyPoints.map((point) => (
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
          <CtaButton href="/contact" className="mt-12">
            Start a Project
          </CtaButton>
        </div>
      </section>
    </>
  );
}
