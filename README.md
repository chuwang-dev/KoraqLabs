# Koraq Labs

Company website for **Koraq Labs**, a Nigerian digital product studio building
websites and landing pages for Nigerian businesses.

Built with Next.js (App Router), React, TypeScript, and Tailwind CSS.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env` and fill in the values you have. Nothing here
is required to run the site locally — the contact form logs submissions to
the server console until `EMAIL_API_KEY` is set.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Only needed if a future feature requires persistent data (e.g. a real portfolio CMS). Not used today. |
| `EMAIL_API_KEY` | API key for the transactional email provider (defaults to a Resend-compatible request). Contact form emails are skipped (and logged) if unset. |
| `EMAIL_TO` | Inbox that receives contact form submissions. |
| `EMAIL_FROM` | "From" address used when sending contact form emails. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, used in metadata and the sitemap. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (international format, no `+` or spaces) used by every WhatsApp CTA on the site. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID. Analytics script is omitted entirely if unset. |

## Project structure

```text
app/            Routes (App Router), one folder per page, plus the contact
                form's server action under app/actions/
components/     Reusable UI split by section/purpose
lib/            Site config, structured content (services, pricing, FAQ,
                portfolio), validation, and analytics helpers
public/         Static assets (favicon, manifest)
```

Content that changes often — pricing, service descriptions, FAQ answers,
portfolio items — lives in `lib/data.ts` rather than being hard-coded across
components, so updating copy doesn't mean hunting through JSX.

## Scripts

```bash
npm run dev        # local development
npm run build       # production build
  npm run start        # run the standalone production build
npm run lint          # ESLint
npm run typecheck      # TypeScript, no emit
```

## Docker

```bash
docker build -t koraq-labs .
docker run -p 3000:3000 --env-file .env koraq-labs
```

Or with Docker Compose:

```bash
docker compose up --build
```

## Deployment

The project is set up for zero-config deployment to **Vercel** from the
`main` branch. The Docker image runs the regular Next.js production server,
which keeps the same application portable to AWS-compatible targets such as
ECS, App Runner, or Lightsail later without restructuring the app.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, type check, and build
on every push and pull request against `main`.

## Content policy

- No fabricated client names, testimonials, or results appear anywhere on
  the site. The testimonials section stays honest about having no clients
  yet, and portfolio items are clearly labeled as demo concepts.
- Contact details (WhatsApp number, email) are read from
  `lib/config.ts`/environment variables rather than hard-coded per component.
