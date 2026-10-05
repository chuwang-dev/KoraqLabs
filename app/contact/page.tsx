import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { WhatsappLink } from "@/components/whatsapp-link";
import { IconPhone, IconWhatsapp } from "@/components/icons";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.contact.seoTitle,
    description: content.pages.contact.seoDescription,
  };
}

export default async function ContactPage() {
  const { settings } = await getSiteSettings();
  const { content } = await getSiteContent();
  const page = content.pages.contact;

  return (
    <section className="section-pad">
      <div className="container-page grid gap-14 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-ink-500">
            {page.description}
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <WhatsappLink
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(page.whatsappMessage)}`}
              className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
            >
              <IconWhatsapp className="h-5 w-5 text-signal-600" />
              {page.whatsappLabel} {settings.whatsappDisplay}
            </WhatsappLink>
            <a
              href={`tel:+${settings.whatsappNumber}`}
              className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
            >
              <IconPhone className="h-5 w-5" />
              {page.phoneLabel} {settings.whatsappDisplay}
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
