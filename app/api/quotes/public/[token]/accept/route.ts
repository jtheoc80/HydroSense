import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendQuoteAcceptedEmail } from "@/lib/email-quote";
import { sendPushNotification } from "@/lib/pushover";
import { postWebhook } from "@/lib/webhook";
import { submitJotformAgreement } from "@/lib/jotform";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Parse optional body for subscription selection
  let subscriptionSelected: boolean | null = null;
  let acceptedTotal: number | null = null;
  try {
    const body = await request.json();
    subscriptionSelected = body.subscription_selected ?? null;
    acceptedTotal = body.accepted_total ?? null;
  } catch {
    // No body or invalid JSON — fine, proceed without
  }

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

    if (quote.status === "accepted") {
      return NextResponse.json({ ok: true, already: true });
    }

    if (
      quote.status !== "sent" &&
      quote.status !== "viewed"
    ) {
      return NextResponse.json(
        { ok: false, error: `Cannot accept quote with status '${quote.status}'` },
        { status: 400 }
      );
    }

    // Check expiration
    if (quote.expires_at && new Date(quote.expires_at) < new Date()) {
      await supabase
        .from("quotes")
        .update({ status: "expired" })
        .eq("id", quote.id);
      return NextResponse.json(
        { ok: false, error: "This quote has expired" },
        { status: 410 }
      );
    }

    // Build notes about subscription choice
    const subNote = subscriptionSelected != null
      ? `\nCustomer ${subscriptionSelected ? "accepted" : "declined"} subscription at acceptance.`
      : "";
    const updatedNotes = (quote.notes_internal || "") + subNote;

    const { error } = await supabase
      .from("quotes")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        total: acceptedTotal ?? quote.total,
        has_commitment: subscriptionSelected ?? false,
        notes_internal: updatedNotes,
      })
      .eq("id", quote.id);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    // Side effects
    await Promise.allSettled([
      sendQuoteAcceptedEmail({
        customer_first_name: quote.customer_first_name,
        customer_email: quote.customer_email,
        quote_number: quote.quote_number,
      }).catch((err) => console.error("Accept email failed:", err)),

      sendPushNotification({
        id: quote.id,
        first_name: `[ACCEPTED] ${quote.quote_number}`,
        last_name: `$${acceptedTotal ?? quote.total}${subscriptionSelected ? " + sub" : ""} — ${quote.customer_first_name} ${quote.customer_last_name}`,
        zip: quote.property_city || quote.property_zip || "",
        lead_tier: "hot",
      }).catch((err) => console.error("Pushover failed:", err)),

      postWebhook({
        event: "quote_accepted",
        quote_id: quote.id,
        lead_id: quote.lead_id,
        customer: {
          first_name: quote.customer_first_name,
          last_name: quote.customer_last_name,
          email: quote.customer_email,
        },
        total: quote.total,
        quote_number: quote.quote_number,
        accepted_at: new Date().toISOString(),
      }).catch((err) => console.error("Webhook failed:", err)),

      submitJotformAgreement({
        quote_number: quote.quote_number,
        first_name: quote.customer_first_name,
        last_name: quote.customer_last_name,
        email: quote.customer_email,
        phone: quote.customer_phone || "",
        address: quote.property_address || "",
        city: quote.property_city || "",
        zip: quote.property_zip || "",
        carrier: quote.carrier || "",
        total: quote.total ?? 0,
        line_items: quote.line_items ?? [],
      }).catch((err) => console.error("Jotform submission failed:", err)),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote accept error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
