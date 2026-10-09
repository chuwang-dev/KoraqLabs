import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/site-settings";
import { ConsentGatedGA } from "@/components/consent-gated-ga";
import { PageViewTracker } from "@/components/page-view-tracker";
import { CookieConsent } from "@/components/cookie-consent";
import { getSiteContent } from "@/lib/site-content";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteSettings();

  // Search-focused homepage title. The on-site tagline (settings.tagline) is
  // left alone so the footer and loader still read "Digital products, built
  // to work." Keep this under ~60 characters so Google doesn't truncate it.
  const homeTitle = `${settings.name} — Website Design for Nigerian Businesses`;

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: homeTitle,
      template: `%s — ${settings.name}`,
    },
    // Edit this in /admin → Settings (the "description" field).
    description: settings.description,
    // Each page gets its own canonical URL (resolved against metadataBase).
    alternates: {
      canonical: "./",
    },
    // meta keywords removed: Google ignores them.
    //
    // openGraph/twitter title, description and url are intentionally NOT set
    // here. Setting them in the root layout made every page (Services, Work,
    // case studies) share the homepage's values. Without them, link scrapers
    // (WhatsApp, Facebook, LinkedIn, X) fall back to each page's own <title>
    // and meta description.
    //
    // The share image comes from a file: add a 1200x630 PNG at
    // app/opengraph-image.png and Next.js attaches it to every page.
    openGraph: {
      siteName: settings.name,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
    icons: {
      icon: [
        { url: "/icons/favicon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icons/favicon-64.png", type: "image/png", sizes: "64x64" },
      ],
    },
    manifest: "/site.webmanifest",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ settings }, { content }] = await Promise.all([
    getSiteSettings(),
    getSiteContent(),
  ]);

  // Basic structured data so Google can understand the business.
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.name,
    url: settings.url,
    description: settings.description,
    areaServed: "NG",
    serviceType: [
      "Website design",
      "Website development",
      "Landing page design",
      "Website redesign",
    ],
  };

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col bg-[#F9F6F2] font-sans text-ink-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <ConsentGatedGA gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
        <PageViewTracker />
        <Navbar
          brandName={settings.name}
          whatsappNumber={settings.whatsappNumber}
          whatsappDisplay={settings.whatsappDisplay}
          content={content}
        />
        <main className="flex-1">{children}</main>
        <Footer content={content} />
        <CookieConsent content={content.consent} />
      </body>
    </html>
  );
}
