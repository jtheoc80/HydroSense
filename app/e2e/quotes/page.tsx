import { notFound } from "next/navigation";
import QuotesListClient from "@/app/admin/quotes/QuotesListClient";
import type { Quote } from "@/app/admin/quotes/types";

export const dynamic = "force-dynamic";

function quoteFixture(overrides: Partial<Quote>): Quote {
  return {
    id: "quote-1",
    quote_number: "Q-2026-0001",
    public_token: "public-token-1",
    lead_id: null,
    site_visit_id: null,
    customer_first_name: "Playwright",
    customer_last_name: "Homeowner",
    customer_email: "playwright@example.test",
    customer_phone: "+12815550100",
    property_address: "100 Test Water Way",
    property_city: "Houston",
    property_zip: "77002",
    carrier: null,
    carrier_premium_estimate: null,
    carrier_discount_pct: null,
    carrier_water_portion_pct: 0.1,
    carrier_annual_estimate: null,
    line_items: [],
    subtotal: 999,
    total: 999,
    notes_internal: null,
    notes_customer: null,
    status: "expired",
    created_at: "2026-05-29T07:02:23.000Z",
    sent_at: null,
    viewed_at: null,
    accepted_at: null,
    declined_at: null,
    expires_at: null,
    ...overrides,
  };
}

export default function QuotesE2EPage() {
  if (process.env.PLAYWRIGHT_TEST_MODE !== "1") notFound();

  const staleQuotes = [
    quoteFixture({ id: "quote-3", quote_number: "Q-2026-0003", total: 899 }),
    quoteFixture({
      id: "quote-2",
      quote_number: "Q-2026-0002",
      public_token: "public-token-2",
      status: "draft",
      total: 799,
    }),
    quoteFixture({}),
  ];

  return <QuotesListClient quotes={staleQuotes} />;
}
