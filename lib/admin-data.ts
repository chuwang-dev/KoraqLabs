import "server-only";
import { isDatabaseConfigured, safeQuery } from "@/lib/db";

// ───────────────────────────────────────────────────────────────────────────
// Shared types
// ───────────────────────────────────────────────────────────────────────────

export type DashboardOverview = {
  usingDemoData: boolean;
  visitors: number;
  pageViews: number;
  leads: number;
  conversionRate: number; // percent, 1 decimal
  whatsappClicks: number;
  projectRequests: number;
  trafficSeries: { date: string; visitors: number; pageViews: number }[];
  trafficSources: { source: string; visitors: number; percentage: number }[];
  topPages: { page: string; views: number; visitors: number }[];
};

export type Lead = {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string;
  business_type: string | null;
  need: string | null;
  current_website: string | null;
  budget: string | null;
  description: string | null;
  source: string | null;
  landing_page: string | null;
  device: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  client_name: string | null;
  industry: string | null;
  description: string | null;
  project_type: string | null;
  technologies: string[];
  website_url: string | null;
  thumbnail_url: string | null;
  status: string;
  featured: boolean;
  completed_at: string | null;
};

export type Testimonial = {
  id: string;
  client_name: string;
  business_name: string | null;
  position: string | null;
  quote: string;
  photo_url: string | null;
  rating: number | null;
  published: boolean;
  featured: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

export type ActivityEntry = {
  id: number;
  admin_email: string;
  action: string;
  detail: string | null;
  created_at: string;
};

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
] as const;

export const PROJECT_STATUSES = [
  "planning",
  "design",
  "development",
  "review",
  "live",
] as const;

// ───────────────────────────────────────────────────────────────────────────
// Demo data — used only when DATABASE_URL is not set. Every consumer of this
// data must surface `usingDemoData: true` in the UI (see the DemoDataBadge
// component) rather than presenting it as real Koraq Labs traffic.
// ───────────────────────────────────────────────────────────────────────────

function demoTrafficSeries(days: number) {
  const series: { date: string; visitors: number; pageViews: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const base = 90 + Math.round(40 * Math.sin(i / 3));
    series.push({
      date: d.toISOString().slice(0, 10),
      visitors: Math.max(12, base + (i % 5) * 6),
      pageViews: Math.max(20, Math.round((base + (i % 5) * 6) * 1.9)),
    });
  }
  return series;
}

function demoOverview(days: number): DashboardOverview {
  const trafficSeries = demoTrafficSeries(Math.min(days, 30));
  const visitors = trafficSeries.reduce((sum, d) => sum + d.visitors, 0);
  const pageViews = trafficSeries.reduce((sum, d) => sum + d.pageViews, 0);
  const leads = Math.max(4, Math.round(visitors * 0.008));

  return {
    usingDemoData: true,
    visitors,
    pageViews,
    leads,
    conversionRate: Number(((leads / visitors) * 100).toFixed(1)),
    whatsappClicks: Math.round(visitors * 0.026),
    projectRequests: Math.round(leads * 0.7),
    trafficSeries,
    trafficSources: [
      { source: "Google", visitors: Math.round(visitors * 0.42), percentage: 42 },
      { source: "Direct", visitors: Math.round(visitors * 0.27), percentage: 27 },
      { source: "Instagram", visitors: Math.round(visitors * 0.15), percentage: 15 },
      { source: "LinkedIn", visitors: Math.round(visitors * 0.09), percentage: 9 },
      { source: "Other", visitors: Math.round(visitors * 0.07), percentage: 7 },
    ],
    topPages: [
      { page: "/", views: Math.round(pageViews * 0.38), visitors: Math.round(visitors * 0.36) },
      { page: "/services", views: Math.round(pageViews * 0.18), visitors: Math.round(visitors * 0.17) },
      { page: "/work", views: Math.round(pageViews * 0.15), visitors: Math.round(visitors * 0.14) },
      { page: "/contact", views: Math.round(pageViews * 0.09), visitors: Math.round(visitors * 0.09) },
      { page: "/about", views: Math.round(pageViews * 0.07), visitors: Math.round(visitors * 0.07) },
    ],
  };
}

const DEMO_LEADS: Lead[] = [
  {
    id: "demo-1",
    name: "Ada Nwosu",
    business_name: "ABC Pharmacy",
    email: "ada@example.com",
    phone: "+2348012345678",
    business_type: "Retail / Pharmacy",
    need: "New website",
    current_website: null,
    budget: "₦250,000–₦500,000",
    description: "Need a site customers can order from and find our branches.",
    source: "google",
    landing_page: "/services",
    device: "mobile",
    status: "new",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "demo-2",
    name: "Tunde Bello",
    business_name: "XYZ Motors",
    email: "tunde@example.com",
    phone: "+2348023456789",
    business_type: "Automotive",
    need: "Landing page",
    current_website: "xyzmotors.ng",
    budget: "₦500,000–₦1,000,000",
    description: "Rebuilding our online presence ahead of a showroom launch.",
    source: "instagram",
    landing_page: "/",
    device: "desktop",
    status: "contacted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "demo-3",
    name: "Chioma Eze",
    business_name: "ABC Realty",
    email: "chioma@example.com",
    phone: "+2348034567890",
    business_type: "Real Estate",
    need: "Web application",
    current_website: null,
    budget: "₦100,000–₦250,000",
    description: "A simple listings page we can update ourselves.",
    source: "direct",
    landing_page: "/contact",
    device: "mobile",
    status: "qualified",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
  },
];

const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-p1",
    slug: "casifla",
    name: "Casifla",
    client_name: "Casifla",
    industry: "E-commerce",
    description: "A demo-concept landing page exploring a clean checkout flow.",
    project_type: "Landing page",
    technologies: ["Next.js", "Tailwind CSS"],
    website_url: null,
    thumbnail_url: "/images/casifla-landing.png",
    status: "live",
    featured: true,
    completed_at: null,
  },
  {
    id: "demo-p2",
    slug: "autoforge",
    name: "AutoForge",
    client_name: "AutoForge",
    industry: "Automotive",
    description: "A demo-concept site for an automotive parts distributor.",
    project_type: "Website",
    technologies: ["Next.js", "Tailwind CSS"],
    website_url: null,
    thumbnail_url: "/images/autoforge-landing.png",
    status: "review",
    featured: false,
    completed_at: null,
  },
];

const DEMO_ACTIVITY: ActivityEntry[] = [
  { id: 3, admin_email: "admin@koraqlabs.com", action: "login", detail: null, created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
  { id: 2, admin_email: "admin@koraqlabs.com", action: "lead_status_change", detail: "Lead #104 changed New → Contacted", created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  { id: 1, admin_email: "admin@koraqlabs.com", action: "project_updated", detail: "Casifla marked as Live", created_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() },
];

// ───────────────────────────────────────────────────────────────────────────
// Dashboard overview
// ───────────────────────────────────────────────────────────────────────────

export async function getDashboardOverview(days = 30): Promise<DashboardOverview> {
  if (!isDatabaseConfigured()) return demoOverview(days);

  const [visitorsRows, pageViewsRows, leadsRows, whatsappRows, projectStartRows, seriesRows, sourceRows, pageRows] =
    await Promise.all([
      safeQuery<{ count: string }>(
        `select count(distinct session_id)::text as count from analytics_events
         where event_name = 'page_view' and created_at >= now() - ($1 || ' days')::interval`,
        [days]
      ),
      safeQuery<{ count: string }>(
        `select count(*)::text as count from analytics_events
         where event_name = 'page_view' and created_at >= now() - ($1 || ' days')::interval`,
        [days]
      ),
      safeQuery<{ count: string }>(
        `select count(*)::text as count from leads where created_at >= now() - ($1 || ' days')::interval`,
        [days]
      ),
      safeQuery<{ count: string }>(
        `select count(*)::text as count from analytics_events
         where event_name = 'whatsapp_click' and created_at >= now() - ($1 || ' days')::interval`,
        [days]
      ),
      safeQuery<{ count: string }>(
        `select count(*)::text as count from analytics_events
         where event_name = 'project_start' and created_at >= now() - ($1 || ' days')::interval`,
        [days]
      ),
      safeQuery<{ date: string; visitors: string; page_views: string }>(
        `select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
                count(distinct session_id)::text as visitors,
                count(*)::text as page_views
         from analytics_events
         where event_name = 'page_view' and created_at >= now() - ($1 || ' days')::interval
         group by 1 order by 1 asc`,
        [days]
      ),
      safeQuery<{ source: string; visitors: string }>(
        `select coalesce(nullif(source, ''), 'Direct') as source,
                count(distinct session_id)::text as visitors
         from analytics_events
         where event_name = 'page_view' and created_at >= now() - ($1 || ' days')::interval
         group by 1 order by 2 desc`,
        [days]
      ),
      safeQuery<{ page: string; views: string; visitors: string }>(
        `select page, count(*)::text as views, count(distinct session_id)::text as visitors
         from analytics_events
         where event_name = 'page_view' and created_at >= now() - ($1 || ' days')::interval
         group by 1 order by 2 desc limit 10`,
        [days]
      ),
    ]);

  const visitors = Number(visitorsRows[0]?.count ?? 0);
  const pageViews = Number(pageViewsRows[0]?.count ?? 0);
  const leads = Number(leadsRows[0]?.count ?? 0);
  const whatsappClicks = Number(whatsappRows[0]?.count ?? 0);
  const projectRequests = Number(projectStartRows[0]?.count ?? 0);
  const totalSourceVisitors = sourceRows.reduce((sum, r) => sum + Number(r.visitors), 0) || 1;

  // No data yet is a legitimate real state (freshly connected DB, zero
  // traffic so far) — distinct from "no DB configured". We don't fall back
  // to demo numbers here; we show real, honest zeros.
  return {
    usingDemoData: false,
    visitors,
    pageViews,
    leads,
    conversionRate: visitors > 0 ? Number(((leads / visitors) * 100).toFixed(1)) : 0,
    whatsappClicks,
    projectRequests,
    trafficSeries: seriesRows.map((r) => ({
      date: r.date,
      visitors: Number(r.visitors),
      pageViews: Number(r.page_views),
    })),
    trafficSources: sourceRows.map((r) => ({
      source: r.source,
      visitors: Number(r.visitors),
      percentage: Math.round((Number(r.visitors) / totalSourceVisitors) * 100),
    })),
    topPages: pageRows.map((r) => ({
      page: r.page,
      views: Number(r.views),
      visitors: Number(r.visitors),
    })),
  };
}

// ───────────────────────────────────────────────────────────────────────────
// Leads
// ───────────────────────────────────────────────────────────────────────────

export async function getLeads(): Promise<{ leads: Lead[]; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { leads: DEMO_LEADS, usingDemoData: true };
  const leads = await safeQuery<Lead>(`select * from leads order by created_at desc limit 200`);
  return { leads, usingDemoData: false };
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (!isDatabaseConfigured()) return DEMO_LEADS.find((l) => l.id === id) ?? null;
  const rows = await safeQuery<Lead>(`select * from leads where id = $1`, [id]);
  return rows[0] ?? null;
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return true; // demo mode: no-op success
  const rows = await safeQuery(
    `update leads set status = $2, updated_at = now() where id = $1 returning id`,
    [id, status]
  );
  return rows.length > 0;
}

export async function insertLead(input: {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType?: string;
  need?: string;
  currentWebsite?: string;
  budget?: string;
  description?: string;
  source?: string;
  landingPage?: string;
  device?: string;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(
    `insert into leads
      (name, business_name, email, phone, business_type, need, current_website, budget, description, source, landing_page, device)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      input.name,
      input.businessName,
      input.email,
      input.phone,
      input.businessType ?? null,
      input.need ?? null,
      input.currentWebsite ?? null,
      input.budget ?? null,
      input.description ?? null,
      input.source ?? "direct",
      input.landingPage ?? null,
      input.device ?? null,
    ]
  );
}

// ───────────────────────────────────────────────────────────────────────────
// Projects
// ───────────────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<{ projects: Project[]; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { projects: DEMO_PROJECTS, usingDemoData: true };
  const projects = await safeQuery<Project>(`select * from projects order by created_at desc`);
  return { projects, usingDemoData: false };
}

export async function upsertProject(input: {
  id?: string;
  slug: string;
  name: string;
  clientName?: string;
  industry?: string;
  description?: string;
  projectType?: string;
  technologies: string[];
  websiteUrl?: string;
  thumbnailUrl?: string;
  status: string;
  featured: boolean;
  completedAt?: string | null;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (input.id) {
    await safeQuery(
      `update projects set slug=$2, name=$3, client_name=$4, industry=$5, description=$6,
         project_type=$7, technologies=$8, website_url=$9, thumbnail_url=$10, status=$11,
         featured=$12, completed_at=$13, updated_at=now()
       where id=$1`,
      [
        input.id, input.slug, input.name, input.clientName ?? null, input.industry ?? null,
        input.description ?? null, input.projectType ?? null, input.technologies,
        input.websiteUrl ?? null, input.thumbnailUrl ?? null, input.status, input.featured,
        input.completedAt ?? null,
      ]
    );
  } else {
    await safeQuery(
      `insert into projects
        (slug, name, client_name, industry, description, project_type, technologies, website_url, thumbnail_url, status, featured, completed_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        input.slug, input.name, input.clientName ?? null, input.industry ?? null,
        input.description ?? null, input.projectType ?? null, input.technologies,
        input.websiteUrl ?? null, input.thumbnailUrl ?? null, input.status, input.featured,
        input.completedAt ?? null,
      ]
    );
  }
}

export async function deleteProject(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(`delete from projects where id = $1`, [id]);
}

export async function updateProjectStatus(id: string, status: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(`update projects set status = $2, updated_at = now() where id = $1`, [id, status]);
}

export async function updateProjectFeatured(id: string, featured: boolean): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(`update projects set featured = $2, updated_at = now() where id = $1`, [id, featured]);
}

// ───────────────────────────────────────────────────────────────────────────
// Testimonials
// ───────────────────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<{ testimonials: Testimonial[]; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { testimonials: [], usingDemoData: true };
  const testimonials = await safeQuery<Testimonial>(`select * from testimonials order by created_at desc`);
  return { testimonials, usingDemoData: false };
}

export async function upsertTestimonial(input: {
  id?: string;
  clientName: string;
  businessName?: string;
  position?: string;
  quote: string;
  photoUrl?: string;
  rating?: number;
  published: boolean;
  featured: boolean;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (input.id) {
    await safeQuery(
      `update testimonials set client_name=$2, business_name=$3, position=$4, quote=$5,
         photo_url=$6, rating=$7, published=$8, featured=$9, updated_at=now() where id=$1`,
      [input.id, input.clientName, input.businessName ?? null, input.position ?? null, input.quote,
        input.photoUrl ?? null, input.rating ?? null, input.published, input.featured]
    );
  } else {
    await safeQuery(
      `insert into testimonials (client_name, business_name, position, quote, photo_url, rating, published, featured)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [input.clientName, input.businessName ?? null, input.position ?? null, input.quote,
        input.photoUrl ?? null, input.rating ?? null, input.published, input.featured]
    );
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(`delete from testimonials where id = $1`, [id]);
}

// ───────────────────────────────────────────────────────────────────────────
// FAQs
// ───────────────────────────────────────────────────────────────────────────

export async function getFaqs(): Promise<{ faqs: Faq[]; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { faqs: [], usingDemoData: true };
  const faqs = await safeQuery<Faq>(`select * from faqs order by sort_order asc, created_at asc`);
  return { faqs, usingDemoData: false };
}

export async function upsertFaq(input: {
  id?: string;
  question: string;
  answer: string;
  sortOrder: number;
  published: boolean;
}): Promise<void> {
  if (!isDatabaseConfigured()) return;
  if (input.id) {
    await safeQuery(
      `update faqs set question=$2, answer=$3, sort_order=$4, published=$5, updated_at=now() where id=$1`,
      [input.id, input.question, input.answer, input.sortOrder, input.published]
    );
  } else {
    await safeQuery(
      `insert into faqs (question, answer, sort_order, published) values ($1,$2,$3,$4)`,
      [input.question, input.answer, input.sortOrder, input.published]
    );
  }
}

export async function deleteFaq(id: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(`delete from faqs where id = $1`, [id]);
}

// ───────────────────────────────────────────────────────────────────────────
// Activity log
// ───────────────────────────────────────────────────────────────────────────

export async function getActivity(): Promise<{ activity: ActivityEntry[]; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { activity: DEMO_ACTIVITY, usingDemoData: true };
  const activity = await safeQuery<ActivityEntry>(
    `select * from admin_activity order by created_at desc limit 100`
  );
  return { activity, usingDemoData: false };
}

export async function logActivity(adminEmail: string, action: string, detail?: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  await safeQuery(
    `insert into admin_activity (admin_email, action, detail) values ($1,$2,$3)`,
    [adminEmail, action, detail ?? null]
  );
}
