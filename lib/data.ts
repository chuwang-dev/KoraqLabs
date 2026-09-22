// Structured content for the site's data-driven sections.
// Edit copy, pricing, services, and portfolio here — not inside components.

/* ---------------------------------- Services --------------------------------- */

export type Service = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "business-websites",
    index: "A",
    title: "Business Websites",
    summary:
      "Professional websites designed to establish credibility, communicate value, and convert visitors into customers.",
    description:
      "A complete website for your business — structured around how your customers actually search for, evaluate, and contact you. We handle information architecture, design, copy direction, and build, so the site works as a sales asset rather than a brochure.",
    deliverables: [
      "4–7 page structure",
      "Mobile-first responsive design",
      "Contact forms and WhatsApp integration",
      "Google Maps and business details",
      "On-page SEO and metadata",
      "Analytics setup",
    ],
  },
  {
    slug: "landing-pages",
    index: "B",
    title: "Landing Pages",
    summary:
      "Focused landing pages for products, campaigns, services, launches, and lead generation.",
    description:
      "A single, focused page built to convert traffic from a specific campaign, product launch, or offer. No competing navigation, no distractions — one clear path from headline to enquiry.",
    deliverables: [
      "One-page conversion-focused layout",
      "Mobile-responsive design",
      "WhatsApp and contact CTAs",
      "Campaign-ready metadata",
      "Basic SEO setup",
    ],
  },
  {
    slug: "web-applications",
    index: "C",
    title: "Web Applications",
    summary:
      "Custom web platforms, dashboards, portals, internal tools, and business systems.",
    description:
      "When a marketing website isn't enough, we build software. Customer portals, admin dashboards, booking systems, internal tools — applications with real data, real users, and real business logic behind them.",
    deliverables: [
      "Custom functionality and business logic",
      "Database design and integration",
      "Authentication and user roles",
      "Admin dashboards and reporting",
      "API integrations",
    ],
  },
  {
    slug: "redesign-optimization",
    index: "D",
    title: "Website Redesign & Optimization",
    summary:
      "Modernize outdated websites — improving user experience, responsiveness, performance, and conversion.",
    description:
      "If your current website looks dated, loads slowly, or breaks on phones, we rebuild it with the same purpose but modern structure, performance, and design — preserving the content and search value you've already built.",
    deliverables: [
      "Audit of your current website",
      "Modern, responsive rebuild",
      "Performance and Core Web Vitals work",
      "Conversion and UX improvements",
      "SEO value preserved where possible",
    ],
  },
];

export type SupportService = {
  title: string;
  description: string;
};

export const supportServices: SupportService[] = [
  {
    title: "Hosting & Deployment",
    description: "Production deployment, environment setup, and release pipelines.",
  },
  {
    title: "Domain & SSL Configuration",
    description: "Domain connection, DNS records, and certificate setup.",
  },
  {
    title: "Website Maintenance",
    description: "Ongoing updates, content changes, and technical support.",
  },
  {
    title: "API Integrations",
    description: "Connecting payments, messaging, CRMs, and third-party services.",
  },
  {
    title: "Custom Business Automation",
    description: "Replacing manual, repetitive processes with software that runs them.",
  },
];

/* ------------------------------- Value props --------------------------------- */

export type ValueProp = {
  number: string;
  title: string;
  description: string;
};

export const valueProps: ValueProp[] = [
  {
    number: "01",
    title: "Business First",
    description:
      "Every project starts with understanding the business, customers, and desired outcome.",
  },
  {
    number: "02",
    title: "Built for Mobile",
    description:
      "Designed around how Nigerian customers actually access the internet.",
  },
  {
    number: "03",
    title: "Fast & Modern",
    description:
      "Modern technologies, responsive interfaces, performance-focused development.",
  },
  {
    number: "04",
    title: "Built to Grow",
    description:
      "Start with a website and evolve into a full digital product when your business needs it.",
  },
];

/* --------------------------------- Portfolio --------------------------------- */

export type ProjectStatus = "live" | "demo";

export type Project = {
  slug: string;
  name: string;
  industry: string;
  type: string;
  status: ProjectStatus;
  description: string;
  longDescription: string;
  technologies: string[];
  liveUrl?: string;
  image?: string;
  highlights: string[];
};

export const projects: Project[] = [
  {
    slug: "casifla",
    name: "Casifla",
    industry: "Hospitality",
    type: "Restaurant Website",
    status: "live",
    description:
      "A refined fine-dining website experience designed to showcase the restaurant, guide guests through its menu, and encourage reservations.",
    longDescription:
      "Casifla needed a website that carried the atmosphere of the restaurant itself — considered, warm, and unhurried — while making the practical things easy: seeing the menu, understanding the space, and making a reservation. The result is a focused site that treats the menu as the centrepiece rather than an afterthought.",
    technologies: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://gitops-infrastructure.onrender.com",
    image: "/images/casifla-landing.png",
    highlights: [
      "Menu-led structure built around how guests browse",
      "Reservation prompts placed at natural decision points",
      "Fully responsive across phones and tablets",
    ],
  },
  {
    slug: "autoforge",
    name: "Autoforge",
    industry: "Automotive",
    type: "Automotive Website",
    status: "live",
    description:
      "A focused auto-parts and repair website that helps dealers, fleets, and drivers explore parts, discover services, and place enquiries through WhatsApp.",
    longDescription:
      "Autoforge serves three distinct audiences — individual drivers, fleet operators, and dealers — each arriving with different questions. The site organises parts and services so each group can find what applies to them quickly, then routes every enquiry into WhatsApp, where this market actually prefers to transact.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    liveUrl: "https://casi-check.vercel.app/",
    image: "/images/autoforge-landing.png",
    highlights: [
      "Parts and services organised by audience",
      "WhatsApp-first enquiry flow",
      "Built on Next.js for speed and SEO",
    ],
  },
  {
    slug: "demo-clinic-site",
    name: "Healthcare Practice",
    industry: "Healthcare",
    type: "Business Website",
    status: "demo",
    description:
      "A demo business website concept for a healthcare practice, showing booking, services, and location pages structured for a Nigerian clinic.",
    longDescription:
      "A concept exploring how a Nigerian clinic might structure its online presence: clear service listings, practitioner profiles, visiting information, and a booking path that works as well on a phone as on a desktop.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Appointment booking flow",
      "Practitioner and service pages",
      "Location and visiting-hours structure",
    ],
  },
  {
    slug: "demo-restaurant-landing",
    name: "Restaurant Launch Page",
    industry: "Hospitality",
    type: "Landing Page",
    status: "demo",
    description:
      "A demo landing page concept built for a restaurant opening, focused on menu highlights, location, and reservation requests.",
    longDescription:
      "A single-page concept for a restaurant opening — built to do one job well: turn campaign traffic into reservations, with menu highlights, location, and an enquiry form on one scroll.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Single-scroll conversion structure",
      "Menu highlights and opening details",
      "Reservation request form",
    ],
  },
  {
    slug: "demo-realty-site",
    name: "Real Estate Agency",
    industry: "Real Estate",
    type: "Business Website",
    status: "demo",
    description:
      "A demo business website concept for a real estate agency, structured around listings, agent profiles, and inquiry forms.",
    longDescription:
      "A concept for an agency website where listings are the product: filterable property cards, agent profiles that build trust, and enquiry forms attached to every listing.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    highlights: [
      "Listing-led information architecture",
      "Agent profiles and contact routing",
      "Per-listing enquiry forms",
    ],
  },
];

export const liveProjects = projects.filter((p) => p.status === "live");
export const demoProjects = projects.filter((p) => p.status === "demo");

/* ---------------------------------- Process ---------------------------------- */

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  optional?: boolean;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "Understand your business, customers, goals, and requirements.",
  },
  {
    number: "02",
    title: "Design",
    description: "Create the structure, visual direction, and user experience.",
  },
  {
    number: "03",
    title: "Build",
    description: "Develop the website or digital product using modern technologies.",
  },
  {
    number: "04",
    title: "Launch",
    description:
      "Deploy, configure the domain, optimize the experience, and hand over the project.",
  },
  {
    number: "05",
    title: "Support",
    description: "Maintenance, updates, improvements, and technical support.",
    optional: true,
  },
];

/* --------------------------------- Industries -------------------------------- */

export const industries = [
  "Healthcare",
  "Real Estate",
  "Hospitality",
  "Retail",
  "Automotive",
  "Professional Services",
  "Education",
  "Startups",
  "Financial Services",
  "Logistics",
];

/* ---------------------------------- Packages --------------------------------- */

export type PricingPackage = {
  slug: string;
  name: string;
  tagline: string;
  audience: string;
  priceLabel: string;
  features: string[];
};

export const pricingPackages: PricingPackage[] = [
  {
    slug: "starter",
    name: "Starter",
    tagline: "Landing Page",
    audience: "For businesses that need a focused online presence.",
    priceLabel: "From ₦250,000",
    features: [
      "One-page website",
      "Mobile responsive",
      "WhatsApp CTA",
      "Contact form",
      "Basic SEO",
      "Domain connection",
      "Deployment",
    ],
  },
  {
    slug: "business",
    name: "Business",
    tagline: "Business Website",
    audience: "For established businesses that need a full online presence.",
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
  },
  {
    slug: "custom",
    name: "Custom",
    tagline: "Web Application / Digital Product",
    audience: "For businesses with specific functional requirements.",
    priceLabel: "Custom pricing",
    features: [
      "Custom functionality",
      "Database integration",
      "API integrations",
      "Authentication",
      "Advanced forms",
      "Admin functionality",
      "Custom deployment",
    ],
  },
];

/* --------------------------------- Technology -------------------------------- */

export type TechGroup = {
  label: string;
  items: string[];
};

export const techGroups: TechGroup[] = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "REST APIs", "PostgreSQL"] },
  { label: "Infrastructure", items: ["GitHub", "Vercel", "Cloud platforms", "Docker"] },
  { label: "Integrations", items: ["Payment gateways", "WhatsApp", "CMS platforms", "Analytics"] },
];

/* ------------------------------- Growth ladder ------------------------------- */

export type GrowthStage = {
  stage: string;
  title: string;
  description: string;
};

export const growthStages: GrowthStage[] = [
  {
    stage: "Start",
    title: "Landing Page",
    description: "One focused page to establish presence and capture enquiries.",
  },
  {
    stage: "Grow",
    title: "Business Website",
    description: "A full site that carries your services, credibility, and customer paths.",
  },
  {
    stage: "Scale",
    title: "Web Application",
    description: "Portals, dashboards, and systems that serve customers and staff.",
  },
  {
    stage: "Automate",
    title: "Digital Business System",
    description: "Software that runs the repetitive parts of the business for you.",
  },
];

/* ---------------------------------- Company ---------------------------------- */

export const company = {
  about: [
    "Koraq Labs is a Nigerian technology studio focused on building practical digital products for businesses.",
    "We believe technology should solve business problems, not simply look impressive.",
    "From a high-converting landing page to a complete business platform, we combine strategy, design, and software development to create digital experiences that businesses can actually use and grow with.",
  ],
  mission:
    "To give Nigerian businesses digital products that are genuinely useful — built with the same standard of craft as the software they use every day.",
  vision:
    "To become a long-term technology partner for businesses across Nigeria, growing with them from their first website to the systems that run their operations.",
  values: [
    {
      title: "Simplicity",
      description: "The simplest solution that solves the problem is the right one.",
    },
    {
      title: "Reliability",
      description: "Things we build should work, keep working, and be easy to maintain.",
    },
    {
      title: "Practical Innovation",
      description: "New technology is worth using when it makes a real difference.",
    },
    {
      title: "Business Impact",
      description: "Design and code are judged by what they do for the business.",
    },
    {
      title: "Continuous Improvement",
      description: "Every project should be better made than the one before it.",
    },
  ],
};

/* ------------------------------------ FAQ ------------------------------------ */

export type FaqItem = { question: string; answer: string };

export const faqItems: FaqItem[] = [
  {
    question: "How long does a website take?",
    answer:
      "Most standard business websites can be completed within 1–2 weeks depending on the scope and how quickly content is available. Landing pages are usually faster; web applications depend entirely on the functionality required.",
  },
  {
    question: "Do you build websites for new businesses?",
    answer:
      "Yes. We can help structure the website even if your business is just getting started, including working out what the site needs to say before it's written.",
  },
  {
    question: "Can you redesign an existing website?",
    answer:
      "Yes. We audit what you have, keep what's working, and rebuild the rest with modern structure, performance, and design.",
  },
  {
    question: "Do you provide domain and hosting setup?",
    answer:
      "Yes. We can configure your domain, DNS, SSL, hosting, and deployment as part of the project.",
  },
  {
    question: "Will my website work on mobile?",
    answer:
      "Yes. Everything we build is designed mobile-first, because that's how most Nigerian customers will reach you.",
  },
  {
    question: "Can you maintain the website after launch?",
    answer:
      "Yes. Maintenance, updates, and technical support are available as an optional ongoing service.",
  },
  {
    question: "Can you integrate WhatsApp?",
    answer:
      "Yes. WhatsApp enquiry buttons and pre-filled message links are standard on most of the sites we build.",
  },
  {
    question: "Can you build web applications?",
    answer:
      "Yes. For projects needing functionality beyond a marketing website — dashboards, portals, booking systems, internal tools — we develop custom web applications.",
  },
  {
    question: "How much does a website cost?",
    answer:
      "Landing pages start from ₦250,000 and business websites from ₦750,000. Web applications and custom digital products are quoted per project, based on the functionality involved.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Send us your details through the enquiry form or message us on WhatsApp. We'll come back with questions, a recommended approach, and next steps.",
  },
];

/* ---------------------------------- Form data -------------------------------- */

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
  "Financial services",
  "Event planning",
  "Other",
];

export const projectNeeds = [
  "New business website",
  "Landing page",
  "Web application",
  "Website redesign",
  "Hosting & deployment help",
  "Not sure yet",
];
