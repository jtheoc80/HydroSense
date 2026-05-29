import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendPushNotification } from "@/lib/pushover";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("public_token", token)
      .single();

    if (!quote) {
      return NextResponse.json(
        { ok: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    if (quote.status === "declined") {
      return NextResponse.json({ ok: true, already: true });
    }

    if (quote.status !== "sent" && quote.status !== "viewed") {
      return NextResponse.json(
        { ok: false, error: `Cannot decline quote with status '${quote.status}'` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("quotes")
      .update({
        status: "declined",
        declined_at: new Date().toISOString(),
      })
      .eq("id", quote.id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    await sendPushNotification({
      id: quote.id,
      first_name: `[DECLINED] ${quote.quote_number}`,
      last_name: `${quote.customer_first_name} ${quote.customer_last_name}`,
      zip: quote.property_zip || "",
      lead_tier: "cold",
    }).catch((err) => console.error("Pushover failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote decline error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
