import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageViewTracker } from "@/components/page-view-tracker";
import { CookieConsent } from "@/components/cookie-consent";
import { getSiteSettings } from "@/lib/site-settings";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getSiteSettings();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PageViewTracker />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar
        brandName={settings.name}
        whatsappNumber={settings.whatsappNumber}
        whatsappDisplay={settings.whatsappDisplay}
      />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} />
      <CookieConsent />
    </div>
  );
}
