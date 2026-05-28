# HydroSense

Branded marketing site for [hydrosensetx.com](https://hydrosensetx.com). Licensed Texas smart water shutoff installs with carrier-recognized certification for homeowners insurance discounts.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- Supabase (Postgres via service role)
- Resend (transactional email)
- Vercel (deploy target)

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (all sections) |
| `/api/lead` | POST — lead capture endpoint |
| `/admin/leads` | Basic auth protected lead management |

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
2. Add and verify the domain `hydrosensetx.com` (or use their test domain for dev).
3. Copy your API key.

### 4. Set environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required for core functionality:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `RESEND_API_KEY` — Resend API key
- `ADMIN_PASSWORD` — Password for /admin/leads

Optional:
- `LEAD_WEBHOOK_URL` — POST leads to your CRM (Zapier/n8n/Make/HubSpot)
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta (Facebook) Pixel ID
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID` — Google Ads conversion ID
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` — Google Ads conversion label

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Deploy to Vercel

```bash
npx vercel
npx vercel env pull    # sync env vars if set in dashboard
npx vercel --prod      # production deploy
```

Or connect the GitHub repo in the Vercel dashboard for automatic deploys on push.

### 7. Point domain

Add these DNS records for `hydrosensetx.com`:

| Type | Name | Value |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Then add the domain in Vercel: Project Settings > Domains > Add `hydrosensetx.com`.

## Wire Your CRM

The lead API supports a webhook for CRM integration. Set `LEAD_WEBHOOK_URL` to receive a POST with the full lead JSON on every submission.

**Payload shape:**
```json
{
  "id": "uuid",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "zip": "string",
  "address": "string",
  "carrier": "string",
  "message": "string",
  "source": "hydrosensetx.com",
  "page_path": "string",
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string",
  "utm_content": "string",
  "utm_term": "string",
  "referrer": "string",
  "user_agent": "string",
  "ip_address": "string"
}
```

**Integration options:**
- Zapier: Create a Zap with "Webhooks by Zapier" trigger (Catch Hook), paste the URL
- n8n: Webhook node, paste the URL
- Make: HTTP webhook module
- HubSpot: Use Zapier/Make to map fields to HubSpot contacts

## Admin

Navigate to `/admin/leads` and authenticate with `ADMIN_USERNAME` / `ADMIN_PASSWORD` (HTTP Basic Auth). Update lead status (new / contacted / quoted / won / lost) directly from the table.

## Resend Domain Verification

1. In Resend dashboard, go to Domains > Add Domain > `hydrosensetx.com`
2. Add the MX, TXT (SPF), and CNAME (DKIM) records Resend provides to your DNS
3. Click "Verify" in Resend once records propagate
4. The `from` address `leads@hydrosensetx.com` will work once verified
