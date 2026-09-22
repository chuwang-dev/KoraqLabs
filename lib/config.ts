// Central, environment-driven site configuration.

export const siteConfig = {
  name: "Koraq Labs",
  tagline: "Digital products, built to work.",
  description:
    "Koraq Labs is a Nigerian technology studio designing and building websites, landing pages, and web applications for businesses ready to grow.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://koraqlabs.com",
  email: process.env.EMAIL_TO ?? "koraqlabs@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348143832354",
  whatsappDisplay: "0814 383 2354",
  location: "Nigeria",
  brochurePath: "/brochure/koraq-labs-company-profile.pdf",
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
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const footerNav = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/koraqlabs/" },
  { label: "Facebook", href: "https://facebook.com/koraqlabs" },
  { label: "TikTok", href: "https://tiktok.com/@koraqlabs" },
  { label: "Snapchat", href: "https://snapchat.com/add/koraqlabs" },
  { label: "LinkedIn", href: "https://linkedin.com/company/koraqlabs" },
];
