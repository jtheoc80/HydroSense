# HydroSense Texas

Branded marketing site for [hydrosensetx.com](https://hydrosensetx.com) with paid-ad alias [hydrosensehouston.com](https://hydrosensehouston.com). Licensed Texas smart water shutoff installs with carrier-recognized certification for homeowners insurance discounts.

Texas Master Plumber License MPL 43057.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- Supabase (Postgres via service role)
- Resend (transactional email)
- Vercel (deploy target)

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | 12-section landing page |
| `/service-area/[city]` | SSG | 7 city pages (katy, cypress, the-woodlands, sugar-land, spring, baytown, houston) |
| `/api/lead` | POST | Lead capture endpoint |
| `/admin/leads` | Dynamic | Basic auth protected lead management |
| `/sitemap.xml` | Auto | Generated sitemap |

## Setup

### 1. Clone and install

```bash
git clone git@github.com:jtheoc80/HydroSense.git
cd HydroSense
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL Editor and run the contents of `supabase/migrations/0001_init.sql`.
3. Copy your project URL and service role key from Settings > API.

### 3. Create Resend account

1. Sign up at [resend.com](https://resend.com).
2. Add and verify the domain `hydrosensetx.com` (see Resend Domain Verification below).
3. Copy your API key.

### 4. Set environment variables

```bash
cp .env.example .env.local
```

Required for core functionality:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `RESEND_API_KEY` - Resend API key
- `ADMIN_PASSWORD` - Password for /admin/leads

Optional:
- `LEAD_WEBHOOK_URL` - POST leads to your CRM (Zapier/n8n/Make/HubSpot)
- `NEXT_PUBLIC_GA_ID` - Google Analytics 4 measurement ID
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta (Facebook) Pixel ID
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` - Google Ads conversion ID
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` - Google Ads conversion label
- `GOOGLE_BUSINESS_PROFILE_URL` - Google Business Profile link (shown in footer)

### 5. Run locally

```bash
npm run dev
```

### 6. Deploy to Vercel

```bash
npx vercel
npx vercel --prod
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push.

### 7. DNS for hydrosensetx.com

| Type | Name | Value |
|---|---|---|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

Add `hydrosensetx.com` in Vercel > Project Settings > Domains.

### 8. DNS for hydrosensehouston.com (paid-ad alias)

| Type | Name | Value |
|---|---|---|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

Add `hydrosensehouston.com` in Vercel > Project Settings > Domains. The `next.config.mjs` rewrite routes all traffic from this domain to `/service-area/houston`. Canonical tags point back to `hydrosensetx.com`.

## Wire Your CRM

Set `LEAD_WEBHOOK_URL` to receive a POST with the full lead JSON on every submission. Payload includes all form fields, UTM parameters, city tag, campaign, referrer, user agent, and IP.

Integration options:
- Zapier: Webhooks by Zapier trigger (Catch Hook)
- n8n: Webhook node
- Make: HTTP webhook module
- HubSpot: Use Zapier/Make to map fields to HubSpot contacts

## Resend Domain Verification

1. Resend Dashboard > Domains > Add `hydrosensetx.com`
2. Add the 3 DNS records Resend provides (MX, TXT/SPF, CNAME/DKIM)
3. Click Verify once records propagate
4. Both `leads@hydrosensetx.com` (notifications) and `hello@hydrosensetx.com` (confirmations) will work after verification

## LLM Crawlability

The site includes aggressive LLM crawlability:
- `/robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, and 12 other AI crawlers
- `/llms.txt` follows the llmstxt.org spec (table of contents)
- `/llms-full.txt` full content dump, regenerated at build time via `scripts/generate-llms-full.ts`
- JSON-LD structured data on every page (Organization, LocalBusiness, Service, FAQPage, BreadcrumbList, Article)
- Sitemap at `/sitemap.xml`

## Admin

Navigate to `/admin/leads` and authenticate with `ADMIN_USERNAME` / `ADMIN_PASSWORD` (HTTP Basic Auth). Update lead status directly from the table.
