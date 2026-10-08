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
  return {
    metadataBase: new URL(settings.url),
    title: {
      default: `${settings.name} — ${settings.tagline}`,
      template: `%s — ${settings.name}`,
    },
    description: settings.description,
    keywords: [
      "website development Nigeria",
      "website design Nigeria",
      "business website Nigeria",
      "website design Abuja",
      "website developer Lagos",
      "website development Lagos",
      "landing page design Nigeria",
      "web development company Nigeria",
    ],
    openGraph: {
      title: `${settings.name} — ${settings.tagline}`,
      description: settings.description,
      url: settings.url,
      siteName: settings.name,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.name} — ${settings.tagline}`,
      description: settings.description,
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

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
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
