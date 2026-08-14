import type { QuoteStatus } from "./quotes";

export interface QuoteRevisionSource {
  quote_number: string;
  lead_id: string | null;
  site_visit_id: string | null;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  property_address: string | null;
  property_city: string | null;
  property_zip: string | null;
  carrier: string | null;
  carrier_premium_estimate: number | null;
  carrier_discount_pct: number | null;
  carrier_water_portion_pct: number | null;
  carrier_annual_estimate: number | null;
  line_items: unknown[];
  subtotal: number;
  total: number;
  deposit_amount: number | null;
  balance_amount: number | null;
  has_commitment: boolean | null;
  commitment_months: number | null;
  notes_internal: string | null;
  notes_customer: string | null;
  status: QuoteStatus;
}

export function quoteRevisionMarker(quoteNumber: string): string {
  return `Revision of ${quoteNumber}`;
}

export function isRevisionDraftFor(
  notesInternal: string | null,
  quoteNumber: string
): boolean {
  if (!notesInternal) return false;
  return (
    notesInternal.includes(quoteRevisionMarker(quoteNumber)) ||
    notesInternal.includes(`Revision draft created from ${quoteNumber}`)
  );
}

export function buildQuoteRevisionInsert(
  source: QuoteRevisionSource,
  quoteNumber: string,
  publicToken: string,
  createdAt = new Date()
) {
  if (source.status === "draft") {
    throw new Error("Draft quotes can be edited directly");
  }

  const revisionNote = `${quoteRevisionMarker(source.quote_number)} created ${createdAt.toISOString()}.`;

  return {
    quote_number: quoteNumber,
    public_token: publicToken,
    lead_id: source.lead_id,
    site_visit_id: source.site_visit_id,
    customer_first_name: source.customer_first_name,
    customer_last_name: source.customer_last_name,
    customer_email: source.customer_email,
    customer_phone: source.customer_phone,
    property_address: source.property_address,
    property_city: source.property_city,
    property_zip: source.property_zip,
    carrier: source.carrier,
    carrier_premium_estimate: source.carrier_premium_estimate,
    carrier_discount_pct: source.carrier_discount_pct,
    carrier_water_portion_pct: source.carrier_water_portion_pct,
    carrier_annual_estimate: source.carrier_annual_estimate,
    line_items: source.line_items,
    subtotal: source.subtotal,
    total: source.total,
    deposit_amount: source.deposit_amount,
    balance_amount: source.balance_amount,
    has_commitment: source.has_commitment,
    commitment_months: source.commitment_months,
    notes_internal: [revisionNote, source.notes_internal].filter(Boolean).join("\n\n"),
    notes_customer: source.notes_customer,
    status: "draft" as const,
    expires_at: null,
  };
}
