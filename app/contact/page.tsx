import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { WhatsappLink } from "@/components/whatsapp-link";
import { IconWhatsapp } from "@/components/icons";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Koraq Labs about your business and what you want to build — we'll get back to you with next steps.",
};

export default function ContactPage() {
  return (
    <section className="section-pad">
      <div className="container-page grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            Let&apos;s build something that works.
          </h1>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-ink-500">
            Tell us about your business and what you want to build. We&apos;ll
            get back to you with the next steps.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <WhatsappLink
              href={whatsappLink("Hi Koraq Labs, I'd like to talk about a website.")}
              className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
            >
              <IconWhatsapp className="h-5 w-5 text-signal-600" />
              WhatsApp {siteConfig.whatsappDisplay}
            </WhatsappLink>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-[15px] text-ink-500 hover:text-ink-900"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
