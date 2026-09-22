import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/ui/contact-form";
import { WhatsappLink } from "@/components/ui/whatsapp-link";
import { IconWhatsapp } from "@/components/ui/icons";
import { siteConfig, socialLinks, whatsappLink } from "@/lib/config";

export function Contact() {
  return (
    <section id="contact" className="section-pad scroll-mt-20">
      <div className="container-page grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-5 text-display-md [font-family:var(--font-display)]">
              Let&apos;s build something that works.
            </h2>
            <p className="mt-5 max-w-sm text-[16px] leading-relaxed text-ink-500">
              Tell us what you&apos;re trying to build. We&apos;ll help you
              determine the right digital solution.
            </p>

            <div className="mt-10 space-y-4 border-t hairline pt-8">
              <WhatsappLink
                href={whatsappLink("Hi Koraq Labs, I'd like to talk about a project.")}
                className="flex items-center gap-3 text-[15px] font-medium text-ink-900 hover:text-signal-600"
              >
                <IconWhatsapp className="h-5 w-5 text-signal-500" />
                WhatsApp {siteConfig.whatsappDisplay}
              </WhatsappLink>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block text-[15px] text-ink-500 hover:text-ink-900"
              >
                {siteConfig.email}
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-ink-400 hover:text-ink-900"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
