import { ContactForm } from "@/components/contact-form";
import { siteConfig, whatsappLink } from "@/lib/config";
import { IconWhatsapp } from "@/components/icons";
import { WhatsappLink } from "@/components/whatsapp-link";

export function ContactSection() {
  return (
    <section id="contact" className="section-pad scroll-mt-[65px]">
      <div className="container-page grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="font-display text-3xl leading-[1.15] text-ink-900 md:text-4xl">
            Let&apos;s build something that works.
          </h2>
          <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-ink-500">
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
