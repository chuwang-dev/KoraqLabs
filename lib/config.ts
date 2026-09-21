// Central, environment-driven site configuration.
// Update these via environment variables rather than editing components directly.

export const siteConfig = {
  name: "Koraq Labs",
  tagline: "Digital products, built to work.",
  description:
    "Koraq Labs builds modern websites and landing pages for Nigerian businesses.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://koraqlabs.com",
  email: process.env.EMAIL_TO ?? "koraqlabs@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348143832354",
  whatsappDisplay: "0814 383 2354",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const primaryNav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/faq" },
];

export const footerNav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  {
    label: "Company Profile",
    href: "/koraq-labs-company-profile.pdf",
    download: true,
  },
];

// Social links for the Koraq Labs accounts.
export const socialLinks = {
  instagram: "https://www.instagram.com/koraqlabs",
  facebook: "https://facebook.com/koraqlabs",
  tiktok: "https://tiktok.com/@koraqlabs",
  snapchat: "https://snapchat.com/add/koraqlabs",
  linkedin: "https://linkedin.com/company/koraqlabs",
};
