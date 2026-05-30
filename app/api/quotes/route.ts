import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      lead_id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      property_address,
      property_city,
      property_zip,
      carrier,
      carrier_premium_estimate,
      carrier_discount_pct,
      carrier_water_portion_pct,
      carrier_annual_estimate,
      line_items,
      subtotal,
      total,
      notes_internal,
      notes_customer,
      deposit_amount,
      balance_amount,
    } = body;

    if (!customer_first_name || !customer_last_name || !customer_email) {
      return NextResponse.json(
        { ok: false, error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    // Generate quote number: Q-YYYY-NNNN
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from("quotes")
      .select("*", { count: "exact", head: true })
      .like("quote_number", `Q-${year}-%`);
    const seq = String((count ?? 0) + 1).padStart(4, "0");
    const quote_number = `Q-${year}-${seq}`;

    const public_token = crypto.randomBytes(16).toString("hex");

    const { data, error } = await supabase
      .from("quotes")
      .insert({
        quote_number,
        public_token,
        lead_id: lead_id || null,
        customer_first_name,
        customer_last_name,
        customer_email,
        customer_phone: customer_phone || null,
        property_address: property_address || null,
        property_city: property_city || null,
        property_zip: property_zip || null,
        carrier: carrier || null,
        carrier_premium_estimate: carrier_premium_estimate ?? null,
        carrier_discount_pct: carrier_discount_pct ?? null,
        carrier_water_portion_pct: carrier_water_portion_pct ?? 0.1,
        carrier_annual_estimate: carrier_annual_estimate ?? null,
        line_items: line_items || [],
        subtotal: subtotal ?? 0,
        total: total ?? 0,
        notes_internal: notes_internal || null,
        notes_customer: notes_customer || null,
        deposit_amount: deposit_amount ?? null,
        balance_amount: balance_amount ?? null,
        status: "draft",
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Quote insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to create quote" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, quote: data });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, quotes: data || [] });
  } catch (err) {
    console.error("Quotes list error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
