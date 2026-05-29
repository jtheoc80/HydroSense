import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendQuoteEmail } from "@/lib/email-quote";
import { sendQuoteSms } from "@/lib/sms-quote";
import { sendPushNotification } from "@/lib/pushover";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: quote, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !quote) {
      return NextResponse.json(
        { ok: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    if (quote.status !== "draft" && quote.status !== "sent") {
      return NextResponse.json(
        {
          ok: false,
          error: `Cannot send quote with status '${quote.status}'`,
        },
        { status: 400 }
      );
    }

    // Update status to sent
    const { data: updated, error: updateErr } = await supabase
      .from("quotes")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        expires_at:
          quote.expires_at || new Date(Date.now() + 7 * 86400000).toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      return NextResponse.json(
        { ok: false, error: updateErr.message },
        { status: 500 }
      );
    }

    // Fire side effects in parallel
    const results = await Promise.allSettled([
      sendQuoteEmail({
        customer_first_name: quote.customer_first_name,
        customer_email: quote.customer_email,
        quote_number: quote.quote_number,
        total: quote.total,
        public_token: quote.public_token,
        expires_at: updated.expires_at,
      }).catch((err) => console.error("Quote email failed:", err)),

      sendQuoteSms({
        customer_first_name: quote.customer_first_name,
        customer_phone: quote.customer_phone,
        public_token: quote.public_token,
        expires_at: updated.expires_at,
      }).catch((err) => console.error("Quote SMS failed:", err)),

      sendPushNotification({
        id: quote.id,
        first_name: `Quote sent: ${quote.quote_number}`,
        last_name: `to ${quote.customer_first_name} ${quote.customer_last_name}`,
        zip: quote.property_zip || "",
        lead_score: quote.total,
        lead_tier: "quote",
      }).catch((err) => console.error("Pushover failed:", err)),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.warn(`${failed.length} quote send side effect(s) rejected`);
    }

    return NextResponse.json({ ok: true, quote: updated });
  } catch (err) {
    console.error("Quote send error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
