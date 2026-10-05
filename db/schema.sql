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
  os               text,                -- Windows / macOS / iOS / Android / Linux / Other
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

-- Migration-safe: adds the column if this table already existed from a
-- deploy before `os` tracking was introduced. `create table if not exists`
-- above only helps on a brand-new database, not an existing one.
alter table analytics_events add column if not exists os text;

-- ─────────────────────────────────────────────────────────────────────────
-- Website health checks. Populated on demand from /admin/website (a
-- "Run check now" button), not on a timer, so it never calls out to
-- PageSpeed Insights on every dashboard page load.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists health_checks (
  id                    bigserial primary key,
  checked_at            timestamptz not null default now(),
  operational           boolean not null,
  status_code           integer,
  response_time_ms      integer,
  ssl_valid             boolean,
  performance_score     integer,          -- 0–100, from PageSpeed Insights (Lighthouse)
  accessibility_score   integer,
  seo_score             integer,
  best_practices_score  integer,
  scores_source         text,             -- e.g. "Google PageSpeed Insights" — null if scores unavailable
  scores_error          text,
  deployment_env        text,             -- from platform env vars where available
  deployment_commit     text,
  checked_url           text,
  error                 text
);

alter table health_checks add column if not exists checked_url text;
alter table health_checks add column if not exists scores_error text;

create index if not exists idx_health_checks_checked_at on health_checks (checked_at desc);

-- ─────────────────────────────────────────────────────────────────────────
-- Login rate limiting. Lives in Postgres (not in-process memory) so it's
-- correct across serverless cold starts and multiple concurrent instances —
-- an in-memory Map resets on every cold start and isn't shared, which makes
-- it close to useless as real brute-force protection once deployed.
-- Keys are sha256 hashes (see lib/rate-limit.ts), never raw IP/email, so a
-- compromised DB doesn't hand over a plaintext list of who tried to log in.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists login_attempts (
  key           text primary key,
  count         integer not null default 1,
  window_start  timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Admin sessions, for real session revocation. The JWT itself is stateless
-- (fast to verify at the edge), but each one carries a `jti` that must also
-- exist here — so "log out everywhere" or a leaked-cookie response is a
-- single DELETE, not a AUTH_SECRET rotation that logs out every session
-- including the one you're using to respond to the incident.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists admin_sessions (
  id           text primary key,  -- jti
  admin_email  text not null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null
);

create index if not exists idx_admin_sessions_expires on admin_sessions (expires_at);

-- ─────────────────────────────────────────────────────────────────────────
-- Public website details editable from /admin/settings.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────
-- Uploaded images (project thumbnails, testimonial photos). Stored in
-- Postgres so uploads work on hosts with no writable disk (Vercel) without
-- adding a third-party storage account. Fine for a handful of small images;
-- if you accumulate hundreds or need a CDN, move to S3/Cloudinary/Blob and
-- keep storing just the URL in projects.thumbnail_url.
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists uploads (
  id            uuid primary key default gen_random_uuid(),
  filename      text,
  content_type  text not null,
  size_bytes    integer not null,
  data          bytea not null,
  uploaded_by   text,
  created_at    timestamptz not null default now()
);

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
