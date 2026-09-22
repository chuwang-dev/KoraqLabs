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
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of the admin password — generate with `npm run hash-password -- "your-password"`. Never the plaintext password. |
| `AUTH_SECRET` | Random secret signing admin session cookies. Generate with `openssl rand -base64 32`. |

---

## Admin dashboard (`/admin`)

A private, server-side-protected dashboard for monitoring traffic, leads, and
site content — not linked from anywhere on the public site, and excluded
from `robots.txt` and the sitemap.

### First-time setup

1. **Generate credentials**
   ```bash
   npm run hash-password -- "choose-a-strong-password"
   openssl rand -base64 32   # → AUTH_SECRET
   ```
   Put the results, plus `ADMIN_EMAIL`, into your deployment's environment
   variables (never into a committed `.env` file).

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
  clicks, and project requests for a selectable date range, plus a traffic
  chart, traffic sources, top pages, and recent leads.
- **Leads** — every contact-form submission, with a status pipeline (New →
  Contacted → Qualified → Proposal Sent → Won/Lost) and a detail view.
- **Projects / Testimonials / FAQs** — lightweight content management for
  the public site's portfolio, testimonials, and FAQ sections. Testimonials
  are never auto-published; an admin must explicitly flip them to
  "Published".
- **Activity** — a log of admin actions (logins, status changes, content
  edits).
- **Settings** — a read-only view of the current environment configuration.
  Nothing is editable from the UI by design: credentials and secrets only
  ever live in environment variables, never in the database or the browser.

### Security notes

- Auth is enforced in `middleware.ts` for every `/admin/*` request (not just
  in the UI), with a second check in the admin layout as defense in depth.
- Passwords are bcrypt-hashed; sessions are signed JWTs in HTTP-only,
  `Secure` (in production), `SameSite=Lax` cookies — never in
  `localStorage`.
- Login attempts are rate-limited (in-memory, 8 attempts / 15 minutes per
  IP+email — fine for a single-admin dashboard; swap for a shared store if
  you run multiple instances).
- Analytics events store a session id, page, coarse device/browser/traffic
  source, and — only where your host provides it — a coarse country/city.
  No IP addresses, no precise location, no personal identifiers.

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
