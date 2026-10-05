# Koraq Labs

Company website for **Koraq Labs**, a Nigerian technology and digital product
studio building websites, landing pages, and web applications.

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion

---

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

Real project screenshots and the brand logo already live in `public/images/`
— nothing to copy in before first run.

---

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GMAIL_USER` | Gmail address that sends and receives contact form mail. |
| `GMAIL_APP_PASSWORD` | 16-character Gmail **App Password** (not your login password). |
| `EMAIL_TO` | Optional — inbox for submissions if different from `GMAIL_USER`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, used in metadata and the sitemap. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, no `+` or spaces. Drives every WhatsApp CTA. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID. The script is omitted entirely if unset. |
| `DATABASE_URL` | Postgres connection string. Leave blank to run the admin dashboard in demo-data mode. |
| `ADMIN_EMAIL` | The one administrator's login email. |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of the admin password — generate with `npm run hash-password` to enter it without echoing it or placing it in shell history. Never store the plaintext password. |
| `AUTH_SECRET` | Random secret signing admin session cookies. Generate with `openssl rand -base64 32`. |

---

## Admin dashboard (`/admin`)

A private, server-side-protected dashboard for monitoring traffic, leads, and
site content — not linked from anywhere on the public site, and excluded
from `robots.txt` and the sitemap.

### First-time setup

1. **Generate credentials**
   ```bash
  npm run admin:setup
   ```
  Enter the admin email and a new password twice at the hidden prompts. This
  writes the bcrypt hash and a generated session secret to `.env.local`; restart
  the dev server afterward. Do not commit `.env.local`.

2. **(Optional) connect a database.** Without `DATABASE_URL`, `/admin/login`
   and every dashboard page still work, but every number is demo data,
   clearly labeled, and nothing you add (leads, projects, testimonials,
   FAQs) is saved. To get real, persistent data:
   ```bash
   createdb koraq_labs   # or use a managed Postgres (Neon, Supabase, RDS, etc.)
   psql "$DATABASE_URL" -f db/schema.sql
   ```
   Set `DATABASE_URL` in your environment and redeploy. From that point:
   - Every contact-form submission is saved as a lead automatically.
   - `page_view`, `whatsapp_click`, `cta_click`, `portfolio_click`,
     `pricing_view`, and `service_view` events (already firing from the
     public site) start persisting to `analytics_events`, and the dashboard
     switches from demo data to real numbers.
   - Projects, testimonials, and FAQs become editable from `/admin`.

3. **Log in** at `/admin/login` with `ADMIN_EMAIL` and the password you hashed.

### What's in it

- **Dashboard** — visitors, page views, leads, conversion rate, WhatsApp
  clicks, and project requests for a selectable date range (Today,
  Yesterday, Last 7/30/90 days, This month, Last month, or a custom
  from/to range), plus a traffic chart, traffic sources, top pages,
  device/browser/OS breakdowns, a country + Nigeria-city location
  breakdown, and a conversion funnel (Visitors → Viewed Services → Viewed
  Pricing → Started Project → Contacted Koraq → Qualified Lead).
- **Leads** — every contact-form submission, with a status pipeline (New →
  Contacted → Qualified → Proposal Sent → Won/Lost) and a detail view.
- **FAQs** — manage published questions and answers for `/faq` and the
  homepage. Built-in FAQs are used when `DATABASE_URL` is not configured.
- **Projects / Testimonials** — add, edit, publish, and remove portfolio
  projects and testimonials. Published projects appear on `/work` and its
  detail pages; published testimonials appear on the homepage.
- **Site Content** — edit homepage sections, About/Services/Work/FAQ/Contact
  copy, page metadata, service and pricing lists, navigation, contact form
  labels/options, consent copy, and the privacy policy from `/admin/content`.
  Homepage sections can be hidden individually. This content is stored in the
  `site_settings` JSONB table and uses built-in defaults until saved. Review
  legal copy before publishing changes to the privacy policy.
- **Website** — a real, on-demand health check: fetches the live site to
  measure reachability, response time, and SSL, and (best-effort) pulls
  Lighthouse Performance/Accessibility/SEO/Best Practices scores from
  Google PageSpeed Insights — clearly labeled with that source, and left
  blank (never guessed) if the request fails. Nothing runs on a timer; it
  only runs when you click "Run check now", so it never eats your PageSpeed
  quota or slows down a dashboard page load.
- **Activity** — a log of admin actions (logins, status changes, content
  edits, health checks).
- **Settings** — edit the site name, tagline, description, canonical URL,
  contact details, WhatsApp number, and social links. The public navbar,
  footer, contact sections, metadata, robots file, and sitemap use the saved
  values. Set `ADMIN_EMAIL`, an initial `ADMIN_PASSWORD_HASH`, and `AUTH_SECRET`
  for first login. Afterward, change the password from Settings; the new bcrypt
  hash is stored in Postgres. `AUTH_SECRET` and 2FA secrets remain environment-driven.
  The same page links to authenticator-based 2FA setup and session revocation.

Page layout, styling, and interactive behavior remain code-controlled.
Database-backed content editing requires `DATABASE_URL`; analytics credentials
and authentication secrets stay in deployment environment variables.

### Security notes

- Auth is enforced in `middleware.ts` for every `/admin/*` request (not just
  in the UI), with a second check in the admin layout as defense in depth.
- Passwords are bcrypt-hashed; sessions are signed JWTs in HTTP-only,
  `Secure` (in production), `SameSite=Lax` cookies — never in
  `localStorage`.
- Login attempts are rate-limited **in Postgres** (`login_attempts` table),
  not in-process memory — this is the part that actually matters in
  production: an in-memory counter resets on every serverless cold start
  and isn't shared across instances, so it gives almost no real protection
  once deployed. The Postgres version uses an atomic `INSERT ... ON
  CONFLICT DO UPDATE`, so concurrent requests can't race past the limit.
  Two layers apply together: 8 attempts / 15 min per account, 20 / 15 min
  per IP (catches one IP spraying multiple email guesses). Keys are sha256
  hashes, not raw IP/email, so the table never holds a plaintext log of who
  tried to log in. If `DATABASE_URL` isn't set, this falls back to an
  in-memory limiter — fine for local/demo use, but rotate in a database
  before exposing `/admin/login` publicly.
  Optionally, prune old rows on a schedule (e.g. a daily cron or Vercel
  Cron Job) so the table doesn't grow forever:
  ```sql
  delete from login_attempts where updated_at < now() - interval '1 day';
  ```
- Analytics events store a session id, page, and coarse device/browser/OS/
  traffic source, plus — only from edge/CDN headers, never an external
  lookup — a coarse country/city where the host provides it: full support
  on Vercel, country + city on Netlify, country only on Cloudflare, none on
  a plain VPS or hosts that don't inject these headers (Railway, Fly.io).
  No IP addresses, no precise location, no personal identifiers.

> **Upgrading an existing deployment?** Rerun `psql "$DATABASE_URL" -f
> db/schema.sql` after pulling these changes — it's additive and safe to
> run again, and adds the new `os` column on `analytics_events` plus the
> `health_checks`, `admin_sessions`, `uploads`, and `site_settings` tables.

### Additional hardening & compliance (latest round)

- **Session revocation** — each login stores a session id in `admin_sessions`;
  logout deletes it, and *Settings → Revoke all sessions* logs out every
  device at once. (Requires `DATABASE_URL`; without it sessions are
  stateless and only `AUTH_SECRET` rotation invalidates them.)
- **CSRF** — `middleware.ts` rejects any state-changing `/admin` request
  whose Origin/Referer doesn't match the site's host, on top of Next.js's
  built-in Server Action protections.
- **Failed logins** are recorded in *Activity* (highlighted red).
- **Form feedback** — Projects, Testimonials and FAQs now show real save
  errors (e.g. a duplicate project slug) instead of silently doing nothing.
- **Leads** — search, pagination (25/page), CSV export (spreadsheet
  formula-injection safe), and duplicate detection (same email within 30
  minutes is not stored twice).
- **Website health** — 60-second cooldown on "Run check now", a history
  table, and an alert email when a check comes back "Attention Required".
- **Timezone** — date presets (Today, This month, …) use West Africa Time
  (UTC+1) rather than the server's timezone.
- **Consent** — a cookie banner gates *all* analytics (our own events and
  Google Analytics) until a visitor accepts; `/privacy` explains what is
  collected and lets visitors change their choice. Have the policy text
  reviewed against your legal obligations (e.g. the Nigeria Data
  Protection Act) before launch.

Rerun `psql "$DATABASE_URL" -f db/schema.sql` to add the `admin_sessions`
table (safe to run repeatedly).

### Two-factor authentication & image uploads

- **2FA (TOTP)** — works with Google Authenticator, Authy, 1Password, etc.
  Log in, open *Settings → Two-factor authentication*, scan the QR code,
  confirm a code, then set `ADMIN_TOTP_SECRET` in your environment and
  redeploy. From then on sign-in needs the password *and* a code; codes
  can't be replayed. **Lost your phone?** Remove `ADMIN_TOTP_SECRET` and
  redeploy — login falls back to password-only. Keep access to your
  hosting dashboard. (Adds one dependency, `qrcode`, for the QR image.)
- **Image upload** — the *Upload* button next to thumbnail/photo fields
  stores images (PNG/JPEG/GIF/WebP, max 2 MB) in Postgres and serves them
  from `/api/uploads/<id>`. Files are checked by their real bytes, not the
  filename; SVG is refused because it can carry scripts. Postgres storage
  suits a handful of images — for many, or for CDN delivery, move to
  Cloudinary/S3/Vercel Blob and keep saving just the URL. Requires
  `DATABASE_URL`; pasting an external URL still works without it.

Rerun `psql "$DATABASE_URL" -f db/schema.sql` to add the `uploads` table,
then `npm install` for the new `qrcode` dependency.

### Contact form → Gmail

The form posts to a Next.js server action, which sends through Gmail SMTP via
Nodemailer. Requires 2-Step Verification on the account.

1. Sign in to **koraqlabs@gmail.com**.
2. Turn on 2-Step Verification at myaccount.google.com/security.
3. Generate an App Password at myaccount.google.com/apppasswords.
4. Set `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env` and in your host's
   environment variables.
5. Redeploy or restart.

Submissions arrive with the visitor's address as Reply-To. Without credentials
the form still validates and confirms to the visitor, but only logs
server-side — fine for local development.

---

## Project structure

```text
app/
  actions/contact.ts     server action for the enquiry form
  work/[slug]/           per-project detail pages
  layout.tsx             fonts, metadata, GA, skip link
  sitemap.ts robots.ts   SEO routes
  not-found.tsx error.tsx loading.tsx
components/
  sections/              one file per homepage section
  ui/                    reusable primitives (Button, Reveal, cards, form)
  navbar.tsx footer.tsx mobile-menu.tsx
lib/
  config.ts              site config, nav, socials, WhatsApp
  data.ts                ALL editable content
  mailer.ts              Gmail SMTP
  validations.ts         form rules
  analytics.ts           no-op unless GA configured
public/brochure/         generated company profile PDF
```

**All editable content lives in `lib/data.ts`** — services, projects, pricing,
process, FAQ, industries, values, tech stack. Change copy there, not in JSX.

---

## Adding a real project

Append to `projects` in `lib/data.ts`:

```ts
{
  slug: "client-name",
  name: "Client Name",
  industry: "Retail",
  type: "Business Website",
  status: "live",              // "live" or "demo"
  description: "One line for cards.",
  longDescription: "Paragraph for the detail page.",
  technologies: ["Next.js", "TypeScript"],
  liveUrl: "https://example.com",
  image: "/images/client-name.png",   // omit → abstract block renders
  highlights: ["Point one", "Point two", "Point three"],
}
```

The card, detail page, sitemap entry, and status badge all follow
automatically. `status: "live"` gets the green badge; `"demo"` gets the
outlined one plus a disclaimer on the detail page.

---

## Company brochure

The downloadable PDF lives at
`public/brochure/koraq-labs-company-profile.pdf` — 12 pages, matching the
site's palette, logo, and typography.

It is generated by `scripts/build_brochure.py` (ReportLab + Pillow). It
embeds the real logo (`public/images/koraq-labs-mark.png` /
`-mark-dark.png`) and crops the real project screenshots straight out of
`public/images/` at generation time — no separate brochure-only image files
are kept on disk. Paths are resolved relative to the script itself, so this
works from any checkout. To regenerate after changing content:

```bash
pip install reportlab pillow
python scripts/build_brochure.py
```

Content in that script is currently duplicated from `lib/data.ts` by hand —
if you change pricing or services on the site, update the brochure script too.

---

## Scripts

```bash
npm run dev         # development
npm run build       # production build
npm run start       # serve the build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

## Docker

```bash
docker build -t koraq-labs .
docker run -p 3000:3000 --env-file .env koraq-labs
```

`next.config.ts` uses `output: "standalone"`, so the image is self-contained
and deployable to AWS (ECS, App Runner) without restructuring.

## Deployment

Zero-config on **Vercel** from `main`. GitHub Actions
(`.github/workflows/ci.yml`) runs lint → typecheck → build on every push and PR.

---

## Content policy

No fabricated testimonials, client counts, statistics, awards, partnerships,
team members, or case-study results appear anywhere on the site or in the
brochure. Live client work and self-initiated demo concepts are always
visually distinguished. Where experience in an industry isn't backed by the
portfolio, the copy says so.

## Accessibility & motion

Semantic landmarks, a skip link, visible focus rings, keyboard-operable
accordion and mobile menu with Escape-to-close. All motion is gated behind
`prefers-reduced-motion` — reduced-motion users get static content, not
faster animation.
