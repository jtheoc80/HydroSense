# HydroSense Texas

Branded marketing site for [hydrosensetx.com](https://hydrosensetx.com) with paid-ad alias [hydrosensehouston.com](https://hydrosensehouston.com). Licensed Texas smart water shutoff installs with carrier-recognized certification for homeowners insurance discounts.

Licensed Texas Registered Master Plumber.

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS v3
- Supabase (Postgres via service role)
- Resend (transactional email)
- Twilio (instant SMS)
- Cal.com (booking widget)
- Pushover (founder push notifications)
- Vercel (deploy target)

## Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | 12-section landing page |
| `/service-area/[city]` | SSG | 7 city pages |
| `/book` | Static | Cal.com booking embed |
| `/api/lead` | POST | Lead capture + automation triggers |
| `/api/booking-webhook` | POST | Cal.com booking confirmation sync |
| `/api/admin/update-status` | POST | Pipeline status updates |
| `/admin/leads` | Dynamic | Pipeline + table lead management |
| `/sitemap.xml` | Auto | Generated sitemap |

## Lead Automation Flow

When a lead submits the form, the following fires in parallel within seconds:

1. **Supabase insert** with lead scoring (system of record)
2. **Twilio SMS** to lead's phone with booking link (speed to lead, 10-30 second target)
3. **Resend confirmation email** to lead with 6-step process, booking CTA, estimated savings
4. **Resend notification email** to founder with all lead data + score
5. **Pushover push** to founder's phone (instant mobile alert)
6. **Automation webhook** POST to n8n/Zapier/Make for drip sequences
7. **Legacy webhook** POST (backwards compatible)

Each call is wrapped in try/catch. One failing does not block the others.

### Lead Scoring

Computed server-side before insert:

| Factor | Points |
|---|---|
| Carrier listed (not "Not sure") | +1 |
| ZIP in service area | +1 |
| Address provided | +1 |
| Message field non-empty | +1 |

Score >= 3 = "hot" (gold border in admin, [HOT] tag in notification email, priority field in webhook payload).

### Booking Loop

1. Lead gets SMS with Cal.com booking link
2. Lead books 15-minute slot on `/book`
3. Cal.com fires webhook to `/api/booking-webhook`
4. Webhook matches lead by email, updates Supabase: status = "booked", booked_at, meeting_url
5. Admin pipeline view shows the booking at a glance

## Setup

### 1. Clone and install

```bash
git clone git@github.com:jtheoc80/HydroSense.git
cd HydroSense
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the SQL Editor and run `supabase/migrations/0001_init.sql`.
3. If upgrading from a previous schema, also run `supabase/migrations/0002_add_scoring_and_booking.sql`.
4. Copy your project URL and service role key from Settings > API.

### 3. Set environment variables

```bash
cp .env.example .env.local
```

**Required (core):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `ADMIN_PASSWORD`

**Required (automation):**
- `TWILIO_ACCOUNT_SID` - Twilio Console > Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Console > Auth Token
- `TWILIO_FROM_NUMBER` - Your Twilio phone number (format: +1XXXXXXXXXX)
- `NEXT_PUBLIC_BOOKING_URL` - Full Cal.com booking URL
- `NEXT_PUBLIC_CAL_USERNAME` - Cal.com username (for embed)

**Optional (notifications):**
- `PUSHOVER_USER_KEY` - Pushover user key (pushover.net > Your Key)
- `PUSHOVER_APP_TOKEN` - Pushover app token (pushover.net > Create Application)
- `LEAD_AUTOMATION_WEBHOOK` - n8n/Zapier/Make endpoint URL
- `LEAD_WEBHOOK_URL` - Legacy CRM webhook
- `GOOGLE_BUSINESS_PROFILE_URL` - Google Business Profile link

**Optional (analytics):**
- `NEXT_PUBLIC_GA_ID` - GA4 measurement ID
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta Pixel ID
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`

### 4. Twilio setup

1. Sign up at [twilio.com](https://www.twilio.com).
2. Buy a local phone number (Houston area code 281 or 832 recommended).
3. Copy Account SID, Auth Token, and the phone number to env vars.
4. Register for A2P 10DLC messaging compliance (required for US SMS). Twilio Console > Messaging > Compliance.

### 5. Cal.com setup

1. Sign up at [cal.com](https://cal.com).
2. Create an event type called "hydrosense-quote" (15 min duration).
3. Set your availability.
4. Configure webhook: Settings > Developer > Webhooks > Add.
   - Event trigger: `BOOKING_CREATED`
   - Subscriber URL: `https://hydrosensetx.com/api/booking-webhook`
5. Set `NEXT_PUBLIC_CAL_USERNAME` and `NEXT_PUBLIC_BOOKING_URL` in env.

### 6. Pushover setup

1. Sign up at [pushover.net](https://pushover.net) ($5 one-time, 30-day trial).
2. Install Pushover app on your phone.
3. Copy your User Key from the dashboard.
4. Create an Application/API Token named "HydroSense".
5. Set both in env vars.

### 7. Deploy and DNS

```bash
npx vercel --prod
```

**hydrosensetx.com:**

| Type | Name | Value |
|---|---|---|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

**hydrosensehouston.com:**

| Type | Name | Value |
|---|---|---|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

## Automation Webhook Payload

The `LEAD_AUTOMATION_WEBHOOK` receives a POST with this JSON on every submission:

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
  "city": "string",
  "campaign": "string",
  "source": "hydrosensetx.com",
  "page_path": "string",
  "utm_source": "string",
  "utm_medium": "string",
  "utm_campaign": "string",
  "utm_content": "string",
  "utm_term": "string",
  "referrer": "string",
  "user_agent": "string",
  "ip_address": "string",
  "lead_score": 3,
  "lead_tier": "hot",
  "lead_factors": ["carrier_listed", "zip_in_service_area", "address_provided"],
  "submitted_at": "2026-05-27T14:30:00.000Z",
  "booking_url": "https://cal.com/your-username/hydrosense-quote"
}
```

## n8n Drip Sequence Workflows

The webhook payload supports these downstream sequences. Build these in n8n (not in the Next.js app) so timings are editable without redeployment.

### Sequence 1: Speed follow-up (hot leads)

Trigger: webhook receives payload where `lead_tier` = "hot"

- **T+0**: Webhook fires. SMS and email already sent by the app.
- **T+4 hours**: If lead status is still "new" (check Supabase), send follow-up SMS: "Hi {first_name}, just following up on your HydroSense quote request. Spots this week are filling. Book here: {booking_url}"
- **T+24 hours**: If still "new", send email with personalized savings calculator output based on their carrier and ZIP.
- **T+72 hours**: If still "new", send email with the freeze damage content piece (long-tail risk education).
- **T+7 days**: If still "new", send final email: "Last check-in. Your carrier discount is still available. We are holding your quote."

### Sequence 2: Standard follow-up (warm/cold leads)

Trigger: webhook receives payload where `lead_tier` != "hot"

- **T+4 hours**: SMS follow-up if phone provided and status is "new"
- **T+24 hours**: Email with savings details
- **T+7 days**: Final email

### Sequence 3: Post-booking confirmation

Trigger: Cal.com booking webhook (separate from lead webhook)

- Send prep SMS: "Your HydroSense call is confirmed for {date}. Have your insurance declaration page handy if possible."
- 1 hour before: reminder SMS

### n8n Implementation Notes

- Use the Supabase node to check lead status before sending follow-ups (skip if already "booked" or "quoted")
- Use the Twilio node for SMS, Resend HTTP node for email
- Filter on `lead_tier` in the webhook trigger node to split hot vs standard flows
- Store the n8n workflow JSON exports in a `/docs/n8n-workflows/` folder for version control (not included in this repo, create as needed)

## Admin Pipeline

Navigate to `/admin/leads`. Two views:

- **Pipeline view**: Kanban columns for new / booked / showed / quoted / won / lost. Click status buttons on cards to move between columns. Hot leads (score >= 3) have a gold left border and HOT badge.
- **Table view**: Traditional table with search (name, email, zip, carrier) and source filter (homepage, city page, estimator, paid ad).

## Resend Domain Verification

1. Resend Dashboard > Domains > Add `hydrosensetx.com`
2. Add the 3 DNS records Resend provides (MX, TXT/SPF, CNAME/DKIM)
3. Click Verify once records propagate
4. Senders `leads@hydrosensetx.com` and `hello@hydrosensetx.com` become active

## LLM Crawlability

- `/robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, and 12 other AI crawlers
- `/llms.txt` follows the llmstxt.org spec
- `/llms-full.txt` full content dump, regenerated at build time
- JSON-LD structured data on every page
- Sitemap at `/sitemap.xml`
