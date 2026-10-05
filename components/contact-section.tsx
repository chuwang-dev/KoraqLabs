import { ContactForm } from "@/components/contact-form";
import { IconPhone, IconWhatsapp } from "@/components/icons";
import { WhatsappLink } from "@/components/whatsapp-link";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteContent } from "@/lib/site-content";

export async function ContactSection({ content }: { content: SiteContent }) {
  const section = content.home.contact;
  if (!section.enabled) return null;
  const { settings } = await getSiteSettings();

  return (
    <section id="contact" className="section-pad scroll-mt-[65px]">
      <div className="container-page grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h2 className="font-display text-3xl leading-[1.15] text-ink-900 md:text-4xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-sm text-[17px] leading-relaxed text-ink-500">
            {section.description}
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <WhatsappLink
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(content.pages.contact.whatsappMessage)}`}
              className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
            >
              <IconWhatsapp className="h-5 w-5 text-signal-600" />
              {content.pages.contact.whatsappLabel} {settings.whatsappDisplay}
            </WhatsappLink>
            <a
              href={`tel:+${settings.whatsappNumber}`}
              className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
            >
              <IconPhone className="h-5 w-5" />
              {content.pages.contact.phoneLabel} {settings.whatsappDisplay}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="text-[15px] text-ink-500 hover:text-ink-900"
            >
              {settings.email}
            </a>
          </div>
        </div>

        <ContactForm content={content} />
      </div>
    </section>
  );
}
