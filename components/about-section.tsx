import Image from "next/image";
import { CtaButton } from "@/components/cta-button";

export function AboutSection() {
  return (
    <section className="border-b border-[#C8A2C8]/30 bg-[#F8F3F0]">
      <div className="container-page grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="inline-flex rounded-full border border-[#C8A2C8]/60 bg-[#F3E7F3] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-800">
            Lead developer • founder
          </p>
          <h2 className="mt-6 max-w-xl font-display text-[2.4rem] leading-[1.08] text-ink-900 sm:text-5xl md:text-[3.1rem]">
            I build modern websites that help small businesses look credible and win more customers.
          </h2>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-500">
            Hi, I&apos;m Chuwang Emmanuel, Lead Developer at Koraq Labs in Lagos. I build professional websites for small Nigerian businesses at a price they can actually afford, starting from ₦250,000.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href="/about">Read my story</CtaButton>
            <CtaButton href="/contact" variant="secondary">
              Book a call
            </CtaButton>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[30px] border border-[#D7C9C0] bg-[#F4EAE3] p-3 shadow-[0_28px_70px_rgba(30,17,40,0.08)]">
            <Image
              src="/images/chuwang-emmanuel.jpg"
              alt="Chuwang Emmanuel, Lead Developer and founder of Koraq Labs"
              width={720}
              height={860}
              className="h-[520px] w-full rounded-[24px] object-cover md:h-[620px]"
              priority
            />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-full border border-[#D7C9C0] bg-white/90 px-4 py-2 text-sm font-medium text-ink-900 shadow-md backdrop-blur">
            Lead Developer • Chuwang Emmanuel
          </div>
        </div>
      </div>
    </section>
  );
}
