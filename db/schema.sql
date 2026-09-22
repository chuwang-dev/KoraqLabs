-- Koraq Labs admin system schema.
-- Run against the database pointed to by DATABASE_URL.
--   psql "$DATABASE_URL" -f db/schema.sql

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────────────────
-- Leads: one row per contact-form / project-inquiry submission.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  business_name    text not null,
  email            text not null,
  phone            text not null,
  business_type    text,
  need             text,
  current_website  text,
  budget           text,
  description      text,
  source           text default 'direct',       -- google / instagram / direct / referral / other
  landing_page     text,                          -- page the visitor first arrived on
  device           text,
  status           text not null default 'new',   -- new / contacted / qualified / proposal_sent / won / lost
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_leads_created_at on leads (created_at desc);
create index if not exists idx_leads_status on leads (status);

-- ─────────────────────────────────────────────────────────────────────────
-- Projects: portfolio entries manageable from /admin/projects.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  client_name      text,
  industry         text,
  description      text,
  project_type     text,
  technologies     text[] default '{}',
  website_url      text,
  thumbnail_url    text,
  status           text not null default 'planning', -- planning / design / development / review / live
  featured         boolean not null default false,
  completed_at     date,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_projects_status on projects (status);

-- ─────────────────────────────────────────────────────────────────────────
-- Testimonials: never shown on the public site until published = true.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists testimonials (
  id               uuid primary key default gen_random_uuid(),
  client_name      text not null,
  business_name    text,
  position         text,
  quote            text not null,
  photo_url        text,
  rating           smallint check (rating between 1 and 5),
  published        boolean not null default false,
  featured         boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- FAQs: editable without a code deploy.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists faqs (
  id               uuid primary key default gen_random_uuid(),
  question         text not null,
  answer           text not null,
  sort_order       integer not null default 0,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Analytics events: minimal, privacy-conscious event stream.
-- No IP address or precise geolocation is stored — country/city only, and
-- only when derived from a coarse, non-identifying source.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists analytics_events (
  id               bigserial primary key,
  event_name       text not null,       -- page_view / cta_click / whatsapp_click / contact_form_submit / portfolio_click / pricing_view / service_view
  session_id       text not null,
  page             text,
  source           text,                -- traffic source, resolved from referrer at event time
  device           text,                -- mobile / desktop / tablet
  browser          text,
  country          text,
  city             text,
  metadata         jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists idx_events_created_at on analytics_events (created_at desc);
create index if not exists idx_events_name on analytics_events (event_name);
create index if not exists idx_events_session on analytics_events (session_id);
create index if not exists idx_events_page on analytics_events (page);
create index if not exists idx_events_source on analytics_events (source);

-- ─────────────────────────────────────────────────────────────────────────
-- Admin activity log.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists admin_activity (
  id               bigserial primary key,
  admin_email      text not null,
  action           text not null,        -- login / logout / lead_status_change / project_updated / ...
  detail           text,
  created_at       timestamptz not null default now()
);

create index if not exists idx_activity_created_at on admin_activity (created_at desc);
