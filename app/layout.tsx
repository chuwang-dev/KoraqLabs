import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { ConsentGatedGA } from "@/components/consent-gated-ga";
import "./globals.css";
import { siteConfig } from "@/lib/config";

const display = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Koraq Labs — Websites, Landing Pages & Web Applications for Nigerian Businesses",
    template: "%s — Koraq Labs",
  },
  description: siteConfig.description,
  keywords: [
    "website development Nigeria",
    "website design Nigeria",
    "business website Nigeria",
    "web application development Nigeria",
    "website design Abuja",
    "website developer Lagos",
    "landing page design Nigeria",
    "web development company Nigeria",
    "digital product studio Nigeria",
  ],
  openGraph: {
    title: "Koraq Labs — Digital products, built to work.",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koraq Labs — Digital products, built to work.",
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        {gaId ? <ConsentGatedGA gaId={gaId} /> : null}
        {children}
      </body>
    </html>
  );
}
