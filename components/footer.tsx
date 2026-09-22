import Image from "next/image";
import Link from "next/link";
import { footerNav, siteConfig, socialLinks, whatsappLink } from "@/lib/config";
import { WhatsappLink } from "@/components/ui/whatsapp-link";
import { IconDownload } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-900 text-paper">
      <div className="container-page relative py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/koraq-labs-mark-dark.png"
                alt=""
                width={490}
                height={439}
                className="h-8 w-auto"
              />
              <span className="text-[20px] [font-family:var(--font-display)]">
                Koraq Labs
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[15px] text-white/50">
              {siteConfig.tagline}
            </p>
            <a
              href={siteConfig.brochurePath}
              download=""
              className="mt-7 inline-flex items-center gap-2 rounded border border-white/15 px-4 py-2.5 text-[13px] font-medium text-paper transition-colors hover:bg-white/5"
            >
              <IconDownload className="h-3.5 w-3.5" />
              Company brochure
            </a>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
              Site
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[15px] text-white/65 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">
              Get in touch
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-[15px] text-white/65">
              <li>
                <WhatsappLink href={whatsappLink()} className="hover:text-paper">
                  WhatsApp {siteConfig.whatsappDisplay}
                </WhatsappLink>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-paper">
                  {siteConfig.email}
                </a>
              </li>
              <li className="text-white/40">{siteConfig.location}</li>
            </ul>

            <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-white/40 hover:text-paper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-7 text-[13px] text-white/35">
          © 2026 Koraq Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
