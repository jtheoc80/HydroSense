import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, error: "Quote not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, quote: data });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch current quote
    const { data: existing } = await supabase
      .from("quotes")
      .select("status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    if (existing.status !== "draft") {
      return NextResponse.json(
        {
          ok: false,
          error: "Only draft quotes can be edited",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const allowedFields = [
      "customer_first_name",
      "customer_last_name",
      "customer_email",
      "customer_phone",
      "property_address",
      "property_city",
      "property_zip",
      "carrier",
      "carrier_premium_estimate",
      "carrier_discount_pct",
      "carrier_water_portion_pct",
      "carrier_annual_estimate",
      "line_items",
      "subtotal",
      "total",
      "notes_internal",
      "notes_customer",
      "lead_id",
      "deposit_amount",
      "balance_amount",
    ];

    const update: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        update[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from("quotes")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Quote update error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, quote: data });
  } catch (err) {
    console.error("Quote update error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
