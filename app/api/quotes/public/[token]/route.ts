import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { data: quote, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("public_token", token)
    .single();

  if (error || !quote) {
    return NextResponse.json(
      { ok: false, error: "Quote not found" },
      { status: 404 }
    );
  }

  // Record first view
  if (quote.status === "sent" && !quote.viewed_at) {
    await supabase
      .from("quotes")
      .update({
        status: "viewed",
        viewed_at: new Date().toISOString(),
      })
      .eq("id", quote.id);
    quote.status = "viewed";
    quote.viewed_at = new Date().toISOString();
  }

  // Return only customer-safe fields
  return NextResponse.json({
    ok: true,
    quote: {
      id: quote.id,
      quote_number: quote.quote_number,
      customer_first_name: quote.customer_first_name,
      customer_last_name: quote.customer_last_name,
      customer_email: quote.customer_email,
      customer_phone: quote.customer_phone,
      property_address: quote.property_address,
      property_city: quote.property_city,
      property_zip: quote.property_zip,
      carrier: quote.carrier,
      carrier_premium_estimate: quote.carrier_premium_estimate,
      carrier_discount_pct: quote.carrier_discount_pct,
      carrier_water_portion_pct: quote.carrier_water_portion_pct,
      carrier_annual_estimate: quote.carrier_annual_estimate,
      line_items: quote.line_items,
      subtotal: quote.subtotal,
      total: quote.total,
      notes_customer: quote.notes_customer,
      status: quote.status,
      created_at: quote.created_at,
      expires_at: quote.expires_at,
    },
  });
}
