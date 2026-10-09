import type { Metadata } from "next";
import Image from "next/image";
import { CtaButton } from "@/components/cta-button";

const credentials = [
  "Linux, DevOps & Clouds, Bloomy Technologies (2026)",
  "Cloud Computing, TechCrush (2026)",
  "Business Analysis Masterclass (2025)",
  "PHRi (2025)",
  "TechCrush Alumni Buildathon 3.0, Cloud & DevOps track, Cohort 6",
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About",
    description:
      "Hi, I’m Chuwang Emmanuel, Lead Developer and founder of Koraq Labs. I build modern, affordable websites for small Nigerian businesses.",
  };
}

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-ink-900/10 section-pad">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex rounded-full border border-[#C8A2C8]/50 bg-[#F7EDF6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5B3A5A]">
              About the founder
            </p>
            <h1 className="mt-6 max-w-xl font-display text-4xl leading-[1.08] text-ink-900 md:text-5xl lg:text-[4rem]">
              I build digital experiences that help small businesses look credible and grow with confidence.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-500">
              Hi, I&apos;m Chuwang Emmanuel, Lead Developer at Koraq Labs, based in Lagos. I&apos;ve been building websites for two years, and I still love it.
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
                src="/images/chuwang-emmanuel.jpg"
                alt="Chuwang Emmanuel, Lead Developer and founder of Koraq Labs"
                width={720}
                height={860}
                className="h-[560px] w-full rounded-[22px] object-cover md:h-[620px]"
                priority
              />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-full border border-[#DCC7D5] bg-white/90 px-4 py-2 text-sm font-medium text-ink-900 shadow-md backdrop-blur">
              Lead Developer • Chuwang Emmanuel
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-ink-900/10">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B3A5A]">Why I started</p>
            <h2 className="mt-4 font-display text-3xl text-ink-900 md:text-4xl">
              I wanted to build a better way for small businesses to get online.
            </h2>
          </div>

          <div className="space-y-5 text-[15px] leading-relaxed text-ink-500">
            <p>
              I started Koraq Labs because good small businesses are often stuck offline or overcharged by bigger agencies. I wanted to offer a well-built, professional website at a price small businesses can afford, starting from ₦250,000.
            </p>
            <p>
              This is personal for me. I&apos;ve started a few small businesses myself, and I know how hard it is to grow without the right platform and awareness. I use what I&apos;ve learned to help other owners build a strong online presence, and I love watching them scale.
            </p>
            <p>
              Before I write any code, I talk with you to understand your business and exactly what you need. That avoids endless back-and-forth and gets you a site that fits.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#5B3A5A]">What I build</p>
            <h2 className="mt-4 font-display text-3xl text-ink-900 md:text-4xl">
              Modern, responsive websites built for real business growth.
            </h2>

            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-ink-500">
              <p>
                I build with Next.js and TypeScript, and I handle deployment too: Linux servers, AWS, Nginx, domain setup and SSL configuration. My live work includes Casifla, a fine-dining restaurant website, and AutoForge, an auto-parts website.
              </p>
              <p>
                I&apos;ve also built demo concepts for healthcare, restaurant and real estate businesses. I&apos;m currently working with a team on a cloud and DevOps project for the TechCrush Alumni Buildathon 3.0.
              </p>
              <p>
                Have a project in mind? Message me on WhatsApp and let&apos;s talk.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaButton href="/contact">Get a quote</CtaButton>
              <a href="https://wa.me/2348107342853?text=Hi%20Chuwang%2C%20I%27d%20like%20to%20talk%20about%20a%20website." target="_blank" rel="noreferrer" className="text-sm font-semibold text-ink-900 underline-offset-4 transition hover:text-[#5B3A5A] hover:underline">
                WhatsApp me
              </a>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#E8D8CF] bg-[#FFFDFB] p-6 shadow-[0_20px_45px_rgba(30,17,40,0.04)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5B3A5A]">Credentials</p>
            <ul className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-500">
              {credentials.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#C8A2C8]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
