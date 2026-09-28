import Link from "next/link";
import { footerNav } from "@/lib/config";
import { getSiteSettings } from "@/lib/site-settings";

export async function Footer() {
  const { settings } = await getSiteSettings();

  return (
    <footer className="border-t border-ink-900/10 bg-ink-900 text-paper">
      <div className="container-page section-pad !py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">{settings.name}</p>
            <p className="mt-3 max-w-xs text-[15px] text-ink-300">
              {settings.tagline}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-300">Site</p>
            <ul className="mt-4 flex flex-col gap-3">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    download={item.download}
                    className="text-[15px] text-ink-200 hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-300">Get in touch</p>
            <ul className="mt-4 flex flex-col gap-3 text-[15px] text-ink-200">
              <li>
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="hover:text-paper">
                  WhatsApp {settings.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-paper">
                  {settings.email}
                </a>
              </li>
            </ul>

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {settings.socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ink-400 hover:text-paper"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-paper/10 pt-6 text-sm text-ink-400">
          © 2026 Koraq Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
