import Link from "next/link";
import Image from "next/image";
import { MobileMenu } from "@/components/mobile-menu";
import { CtaButton } from "@/components/cta-button";
import { getSiteSettings } from "@/lib/site-settings";
import type { SiteContent } from "@/lib/site-content";

export async function Navbar({
  brandName,
  whatsappNumber,
  whatsappDisplay,
  content,
}: {
  brandName?: string;
  whatsappNumber?: string;
  whatsappDisplay?: string;
  content: SiteContent;
}) {
  const { settings } = await getSiteSettings();
  const activeBrandName = brandName ?? settings.name;
  const activeWhatsappNumber = whatsappNumber ?? settings.whatsappNumber;
  const activeWhatsappDisplay = whatsappDisplay ?? settings.whatsappDisplay;

  return (
    <header className="sticky top-0 z-50 border-b border-[#C8A2C8]/30 bg-[#FBF6FB]/90 backdrop-blur supports-[backdrop-filter]:bg-[#FBF6FB]/85">
      <div className="container-page flex h-[65px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-ink-900" aria-label={`${activeBrandName} home`}>
          <Image
            src="/images/koraq-labs-logo.png"
            alt="Koraq Labs"
            width={44}
            height={44}
            className="h-11 w-11 rounded-md bg-[#F3E7F3] p-1 object-contain shadow-[0_2px_10px_rgba(200,162,200,0.18)]"
            priority
          />
          <span className="font-display text-xl tracking-[-0.03em]">{activeBrandName}</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {content.navigation.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[15px] text-ink-500 transition-colors duration-200 hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <CtaButton href={content.navigation.primaryCtaHref}>{content.navigation.primaryCta}</CtaButton>
        </div>

        <MobileMenu
          primaryLinks={content.navigation.primary}
          primaryCtaLabel={content.navigation.primaryCta}
          primaryCtaHref={content.navigation.primaryCtaHref}
          whatsappLabel={content.pages.contact.whatsappLabel}
          whatsappMessage={content.pages.contact.whatsappMessage}
          whatsappNumber={activeWhatsappNumber}
          whatsappDisplay={activeWhatsappDisplay}
        />
      </div>
    </header>
  );
}
