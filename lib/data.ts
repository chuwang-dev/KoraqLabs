// Structured content for the site's data-driven sections.
// Editing copy, pricing, or portfolio items here updates every page that uses them.

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "business-websites",
    title: "Business Websites",
    summary:
      "Professional multi-page websites designed to establish credibility and turn visitors into customers.",
    description:
      "A complete website for your business — home, about, services, and contact pages built around how your customers actually search for and reach you. We handle structure, copy direction, and design so the site works as a sales tool, not just a brochure.",
    deliverables: [
      "4–7 page structure",
      "Mobile-first responsive design",
      "Contact forms and WhatsApp integration",
      "Google Maps and business details",
      "Basic on-page SEO",
    ],
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    summary:
      "Focused pages designed for campaigns, products, services, and lead generation.",
    description:
      "A single, focused page built to convert traffic from a specific campaign, product launch, or offer. No distractions — just a clear path from headline to action.",
    deliverables: [
      "One-page conversion-focused layout",
      "Mobile-responsive design",
      "WhatsApp and contact CTAs",
      "Basic SEO setup",
    ],
  },
  {
    slug: "website-redesign",
    title: "Website Redesign",
    summary:
      "Transform outdated websites into modern, responsive, and conversion-focused experiences.",
    description:
      "If your current website looks dated, loads slowly, or doesn't work well on phones, we rebuild it with the same content and purpose but modern structure, design, and performance.",
    deliverables: [
      "Audit of your current website",
      "Modern, responsive rebuild",
      "Improved page speed",
      "Preserved content and SEO value where possible",
    ],
  },
  {
    slug: "hosting-deployment",
    title: "Hosting & Deployment",
    summary:
      "Reliable deployment, domain configuration, SSL, performance monitoring, and ongoing maintenance.",
    description:
      "Once your website is built, we handle getting it live — domain setup, SSL, hosting configuration, and ongoing monitoring — so it stays fast and available.",
    deliverables: [
      "Domain connection and SSL",
      "Production deployment",
      "Uptime and performance monitoring",
      "Optional ongoing maintenance",
    ],
  },
];

export type Industry = {
  name: string;
};

export const industries: Industry[] = [
  { name: "Healthcare" },
  { name: "Real Estate" },
  { name: "Hospitality" },
  { name: "Retail" },
  { name: "Automotive" },
  { name: "Professional Services" },
];

export type PortfolioItem = {
  slug: string;
  category: string;
  name: string;
  description: string;
  technologies: string[];
  isPlaceholder: boolean;
  liveUrl?: string;
  image?: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "casifla",
    category: "Restaurant Website",
    name: "Casifla",
    description:
      "A refined fine-dining website experience designed to showcase the restaurant, guide guests through its menu, and encourage reservations.",
    technologies: ["HTML", "CSS", "JavaScript"],
    isPlaceholder: false,
    liveUrl: "https://gitops-infrastructure.onrender.com",
    image: "/images/casifla-landing.png",
  },
  {
    slug: "autoforge",
    category: "Automotive Website",
    name: "Autoforge",
    description:
      "A focused auto-parts and repair website that helps dealers, fleets, and drivers explore parts, discover services, and place enquiries through WhatsApp.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    isPlaceholder: false,
    liveUrl: "https://casi-check.vercel.app/",
    image: "/images/autoforge-landing.png",
  },
  {
    slug: "demo-clinic-site",
    category: "Business Website",
    name: "Demo — Healthcare Practice",
    description:
      "A demo business website concept for a healthcare practice, showing booking, services, and location pages structured for a Nigerian clinic.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    isPlaceholder: true,
  },
  {
    slug: "demo-restaurant-landing",
    category: "Landing Page",
    name: "Demo — Restaurant Launch Page",
    description:
      "A demo landing page concept built for a restaurant opening, focused on menu highlights, location, and reservation requests.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    isPlaceholder: true,
  },
  {
    slug: "demo-realty-site",
    category: "Business Website",
    name: "Demo — Real Estate Agency",
    description:
      "A demo business website concept for a real estate agency, structured around listings, agent profiles, and inquiry forms.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    isPlaceholder: true,
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "We understand your business, customers, and goals.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We create the visual direction and structure before development.",
  },
  {
    number: "03",
    title: "Build",
    description: "We develop a fast, responsive, and reliable website.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "We deploy your website, connect your domain, and make sure everything works.",
  },
];

export type PricingPackage = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  priceLabel: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

// Prices are configurable here rather than hard-coded across the UI.
export const pricingPackages: PricingPackage[] = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "Landing Page",
    audience: "For businesses that need a focused online presence.",
    priceLabel: "From ₦250,000",
    features: [
      "One-page website",
      "Mobile-responsive design",
      "WhatsApp CTA",
      "Contact form",
      "Basic SEO",
      "Domain connection",
      "Deployment",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Business Website",
    audience:
      "For established businesses that need a professional online presence.",
    priceLabel: "From ₦750,000",
    features: [
      "4–7 pages",
      "Responsive design",
      "Contact forms",
      "WhatsApp integration",
      "Google Maps",
      "Basic SEO",
      "Analytics",
      "Domain connection",
      "Deployment",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/contact",
  },
  {
    slug: "custom",
    name: "Custom",
    tagline: "Custom Website",
    audience: "For businesses with specific requirements.",
    priceLabel: "Talk to us",
    features: [
      "Custom functionality",
      "Database integration where required",
      "API integrations",
      "Authentication where required",
      "Advanced forms",
      "Admin functionality",
      "Custom deployment",
    ],
    ctaLabel: "Talk to Us",
    ctaHref: "/contact",
  },
];

export type WhyPoint = {
  title: string;
  description: string;
};

export const whyPoints: WhyPoint[] = [
  {
    title: "Built for Business",
    description:
      "We don't just make websites look good. We build them around your business goals.",
  },
  {
    title: "Mobile First",
    description:
      "Your customers are on their phones. Your website should work perfectly there.",
  },
  {
    title: "Fast & Modern",
    description:
      "We use modern technologies to create fast, responsive digital experiences.",
  },
  {
    title: "Built to Grow",
    description:
      "Your website can evolve into a larger digital product as your business grows.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "How long does a website take?",
    answer:
      "Most standard business websites can be completed within 1–2 weeks depending on the scope and availability of content.",
  },
  {
    question: "Do you provide domains and hosting?",
    answer:
      "Yes. We can help configure your domain, hosting, SSL, and deployment.",
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Yes.",
  },
  {
    question: "Can you build a website for a new business?",
    answer:
      "Yes. We can help structure the website even if your business is just getting started.",
  },
  {
    question: "Will my website work on mobile?",
    answer: "Yes. All websites should be designed responsively.",
  },
  {
    question: "Can you maintain my website after launch?",
    answer:
      "Yes. Maintenance and support is available as an optional recurring service.",
  },
  {
    question: "Can you build web applications?",
    answer:
      "Yes, for projects requiring functionality beyond a standard marketing website, Koraq Labs can develop custom web applications.",
  },
];

export const budgetRanges = [
  "₦100,000 – ₦250,000",
  "₦250,000 – ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000+",
];

export const businessTypes = [
  "Healthcare",
  "Pharmacy",
  "Restaurant",
  "Hotel",
  "Real Estate",
  "Auto business",
  "School",
  "Professional services",
  "Logistics",
  "Retail",
  "Consulting",
  "Startup",
  "Event planning",
  "Other",
];

export const projectNeeds = [
  "New business website",
  "Landing page",
  "Website redesign",
  "Hosting & deployment help",
  "Not sure yet",
];
