import "server-only";
import { cache } from "react";
import { isDatabaseConfigured, mutate, safeQuery } from "@/lib/db";
import { footerNav, primaryNav } from "@/lib/config";
import {
  budgetRanges,
  businessTypes,
  industries,
  pricingPackages,
  processSteps,
  projectNeeds,
  services,
  whyPoints,
} from "@/lib/data";

export const defaultSiteContent = {
  home: {
    sectionOrder: [
      "hero",
      "about",
      "services",
      "industries",
      "portfolio",
      "process",
      "pricing",
      "whyUs",
      "testimonials",
      "faq",
      "contact",
    ],
    about: {
      enabled: true,
      eyebrow: "Lead developer • founder",
      title: "I build modern websites for businesses that want to look credible and grow without agency clutter.",
      description:
        "Hi, I'm Chuwang Emmanuel, Lead Developer at Koraq Labs in Lagos. I build modern, professional websites that help small businesses win trust and grow online without paying agency-level prices.",
    },
    hero: {
      enabled: true,
      eyebrow: "Koraq Labs",
      headline: "We build websites that help Nigerian businesses get customers and scale effectively.",
      description:
        "We design and build fast, modern websites and landing pages that help Nigerian businesses look credible, reach more customers, and grow online.",
      primaryLabel: "Start a Project",
      primaryHref: "/contact",
      secondaryLabel: "View Our Work",
      secondaryHref: "/work",
    },
    services: {
      enabled: true,
      title: "What We Build",
      linkLabel: "Learn more",
      supporting:
        "From a simple landing page to a complete business website, we build digital experiences designed around your customers.",
    },
    industries: {
      enabled: true,
      title: "Built for Businesses Ready to Grow",
      supporting:
        "Whether you're launching a new business or taking an established company online, we build around the way your customers actually find and contact you.",
    },
    portfolio: {
      enabled: true,
      title: "Our Work",
      supporting: "Real websites. Real businesses. Built to solve real problems.",
      note:
        "We're just getting started — the projects below are labeled demo concepts until we can showcase real client work.",
    },
    process: {
      enabled: true,
      title: "A Simple Process",
      ctaLabel: "Start Your Project",
      ctaHref: "/contact",
    },
    pricing: { enabled: true, title: "Simple Packages. Clear Pricing." },
    whyUs: { enabled: true, title: "Why Businesses Choose Koraq Labs" },
    testimonials: {
      enabled: true,
      title: "What Our Clients Say",
      emptyMessage:
        "Client testimonials will appear here as we launch our first projects.",
    },
    faq: { enabled: true, title: "Frequently Asked Questions" },
    contact: {
      enabled: true,
      title: "Let's build something that works.",
      description:
        "Tell us about your business and what you want to build. We'll get back to you with the next steps.",
    },
  },
  pages: {
    about: {
      seoTitle: "About",
      seoDescription:
        "Koraq Labs is a digital product studio helping Nigerian businesses build a professional online presence.",
      title: "A digital product studio for Nigerian businesses.",
      description:
        "Koraq Labs helps Nigerian businesses establish a professional online presence and acquire customers through high-quality websites and landing pages. Today that means websites and landing pages — built well, and built to last.",
      startingTitle: "Where we're starting",
      startingDescription:
        "We currently build business websites, landing pages, website redesigns, and handle hosting and deployment. Everything we build is designed around how Nigerian customers actually search for and contact a business.",
      futureTitle: "Where we're headed",
      futureDescription:
        "As Koraq Labs grows, our roadmap extends into web applications, SaaS products, AI automation, cloud solutions, DevOps, and custom software — built on the same foundation of clarity and craft we bring to every website today.",
      approachTitle: "How we work",
      ctaLabel: "Start a Project",
      ctaHref: "/contact",
    },
    services: {
      seoTitle: "Services",
      seoDescription:
        "Business websites, landing pages, website redesigns, and hosting & deployment for Nigerian businesses.",
      title: "Websites and landing pages built for how your business actually operates.",
      description:
        "We currently focus on four services — each one aimed at helping Nigerian businesses look credible online and reach more customers.",
      ctaLabel: "Talk to Us",
      ctaHref: "/contact",
    },
    work: {
      seoTitle: "Our Work",
      seoDescription:
        "A look at the websites and landing pages Koraq Labs designs and builds for Nigerian businesses.",
      title: "Our Work",
      description:
        "Real websites. Real businesses. Built to solve real problems. We're just getting started — the projects below are labeled demo concepts until we can showcase real client work.",
    },
    faq: {
      seoTitle: "FAQ",
      title: "Frequently Asked Questions",
      description: "Answers to common questions about working with Koraq Labs.",
      ctaLabel: "Still have questions? Talk to us",
      ctaHref: "/contact",
    },
    contact: {
      seoTitle: "Contact",
      seoDescription:
        "Tell Koraq Labs about your business and what you want to build — we'll get back to you with next steps.",
      title: "Let's build something that works.",
      description:
        "Tell us about your business and what you want to build. We'll get back to you with the next steps.",
      whatsappLabel: "WhatsApp",
      phoneLabel: "Call",
      whatsappMessage: "Hi Koraq Labs, I'd like to talk about a website.",
    },
    privacy: {
      seoTitle: "Privacy Policy",
      seoDescription: "How Koraq Labs collects and uses information on this website.",
      eyebrow: "Legal",
      title: "Privacy Policy",
      updated: "October 2026",
      sections: [
        {
          heading: "Who we are",
          paragraphs: [
            "{siteName} is a Nigerian digital product studio. This policy explains what information this website collects, why, and the choices you have. For any privacy question, email {email}.",
          ],
          showConsentPreferences: false,
        },
        {
          heading: "Information you give us",
          paragraphs: [
            "When you submit the project inquiry form, we receive the details you enter: your name, business name, email address, phone number, business type, the service you're interested in, your budget range, any website URL, and your message. We use this only to respond to your inquiry and to manage our working relationship with you if you become a client. We keep inquiry records for as long as needed for that purpose, and you can ask us to delete yours at any time.",
          ],
          showConsentPreferences: false,
        },
        {
          heading: "Analytics (only with your consent)",
          paragraphs: [
            "If you accept analytics, we record which pages you view and a few actions (such as clicking a call-to-action or the WhatsApp link), together with a random session identifier, your device type, browser, operating system, how you arrived (for example from Google or directly), and a coarse country/city derived from your connection where our hosting provides it.",
            "We do not store your IP address, your name, or precise location in our analytics, and we do not try to identify individual visitors. If you decline, none of this is collected. We may also use Google Analytics if it is enabled on the site; its script is only loaded after you accept, and you can change your choice below at any time.",
          ],
          showConsentPreferences: true,
        },
        {
          heading: "Cookies and local storage",
          paragraphs: [
            "The public site stores your analytics choice in your browser's local storage, and a random session identifier in session storage while analytics is allowed (it disappears when you close the tab). Our private administration area uses a secure, HTTP-only cookie to keep administrators signed in; visitors never receive it.",
          ],
          showConsentPreferences: false,
        },
        {
          heading: "Who we share information with",
          paragraphs: [
            "We don't sell your information. We rely on service providers to run the site (hosting, our database, email delivery, and analytics tools), who process data on our behalf only for those purposes.",
          ],
          showConsentPreferences: false,
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can ask to access, correct, or delete the personal information we hold about you, or to withdraw consent to analytics, by emailing us or using the controls above. We will respond within a reasonable time.",
          ],
          showConsentPreferences: false,
        },
        {
          heading: "Changes",
          paragraphs: [
            "If we change how we handle information, we will update this page and the date above.",
          ],
          showConsentPreferences: false,
        },
      ],
    },
    notFound: {
      eyebrow: "404",
      title: "That page doesn't exist.",
      description:
        "The link may be outdated, or the page may have moved. Everything else is still where you left it.",
      homeLabel: "Back to home",
      homeHref: "/",
      workLabel: "View our work",
      workHref: "/work",
    },
  },
  navigation: {
    primary: primaryNav,
    footer: footerNav.map((item) => ({
      label: item.label,
      href: item.href,
      download: item.download ?? false,
    })),
    primaryCta: "Start a Project",
    primaryCtaHref: "/contact",
    footerSiteHeading: "Site",
    footerContactHeading: "Get in touch",
    copyright: "All rights reserved.",
  },
  mockupLabels: {
    businessWebsite: "Business website",
    landingPage: "Landing page",
  },
  form: {
    submitLabel: "Start My Project",
    submittingLabel: "Sending…",
    validationMessage: "Please check the highlighted fields and try again.",
    successMessage: "Thanks — we've received your project details and will be in touch shortly.",
    errorMessage:
      "Something went wrong sending your message. Please try again or reach us on WhatsApp.",
    fields: {
      name: { label: "Name", placeholder: "Your full name" },
      businessName: { label: "Business name", placeholder: "Your business name" },
      email: { label: "Email", placeholder: "you@business.com" },
      phone: { label: "Phone / WhatsApp", placeholder: "0801 234 5678" },
      businessType: { label: "Business type", placeholder: "Select your industry" },
      need: { label: "What do you need?", placeholder: "Select an option" },
      currentWebsite: {
        label: "Current website URL",
        placeholder: "If you already have one",
      },
      budget: { label: "Budget range", placeholder: "Select a range" },
      description: {
        label: "Project description",
        placeholder: "Tell us about your business and what you'd like your website to do.",
      },
    },
  },
  consent: {
    dialogLabel: "Analytics consent",
    message:
      "We use privacy-friendly analytics (pages visited, device type, and coarse location — never your IP address or name) to understand how the site is used. Nothing is collected unless you accept.",
    privacyLinkLabel: "Read our privacy policy",
    acceptLabel: "Accept analytics",
    declineLabel: "Decline",
    choicePrefix: "Current choice:",
    choiceAllowed: "Analytics allowed",
    choiceDeclined: "Analytics declined",
    choicePending: "Not chosen yet",
    allowPreferencesLabel: "Allow analytics",
    declinePreferencesLabel: "Decline analytics",
  },
  collections: {
    services,
    industries,
    processSteps,
    pricingPackages,
    whyPoints,
    businessTypes,
    projectNeeds,
    budgetRanges,
  },
};

export type SiteContent = typeof defaultSiteContent;

function mergeContent<T>(defaults: T, saved: unknown): T {
  if (Array.isArray(defaults)) {
    if (!Array.isArray(saved)) return defaults;
    if (defaults.length === 0) return saved as T;
    return saved.map((item) => mergeContent(defaults[0], item)) as T;
  }

  if (defaults && typeof defaults === "object") {
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaults;
    const savedRecord = saved as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        mergeContent(value, savedRecord[key]),
      ])
    ) as T;
  }

  if (typeof defaults === "string") {
    return (typeof saved === "string" ? saved : defaults) as T;
  }
  if (typeof defaults === "boolean") {
    return (typeof saved === "boolean" ? saved : defaults) as T;
  }
  if (typeof defaults === "number") {
    return (typeof saved === "number" && Number.isFinite(saved) ? saved : defaults) as T;
  }
  return defaults;
}

export function normalizeSiteContent(value: unknown): SiteContent {
  return mergeContent(defaultSiteContent, value);
}

export const getSiteContent = cache(async (): Promise<{
  content: SiteContent;
  usingDemoData: boolean;
}> => {
  if (!isDatabaseConfigured()) {
    return { content: defaultSiteContent, usingDemoData: true };
  }

  const rows = await safeQuery<{ value: unknown }>(
    `select value from site_settings where key = 'content' limit 1`
  );

  return {
    content: normalizeSiteContent(rows[0]?.value),
    usingDemoData: false,
  };
});

export async function saveSiteContent(
  content: SiteContent
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await mutate(
    `insert into site_settings (key, value, updated_at)
     values ('content', $1::jsonb, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [JSON.stringify(normalizeSiteContent(content))]
  );
  return result.ok ? { ok: true } : result;
}