import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendQuoteEmail } from "@/lib/email-quote";
import { sendQuoteSms } from "@/lib/sms-quote";
import { sendPushNotification } from "@/lib/pushover";
import {
  getQuoteCopyEmail,
  summarizeQuoteDelivery,
  type QuoteDeliveryResult,
} from "@/lib/quote-delivery";

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

    if (quote.status !== "draft" && quote.status !== "sent" && quote.status !== "viewed") {
      return NextResponse.json(
        {
          ok: false,
          error: `Cannot send quote with status '${quote.status}'`,
        },
        { status: 400 }
      );
    }

    const attemptId = crypto.randomUUID();
    const expiresAt =
      quote.expires_at || new Date(Date.now() + 7 * 86400000).toISOString();
    const copyEmail = getQuoteCopyEmail(quote.customer_email);
    const pendingRows = [
      {
        quote_id: id,
        attempt_id: attemptId,
        channel: "email",
        provider: "resend",
        recipient: quote.customer_email?.trim() || "",
        copy_recipient: copyEmail,
        status: "pending",
      },
      {
        quote_id: id,
        attempt_id: attemptId,
        channel: "sms",
        provider: "twilio",
        recipient: quote.customer_phone?.trim() || "",
        copy_recipient: null,
        status: "pending",
      },
    ];

    const { error: logStartError } = await supabase
      .from("quote_delivery_events")
      .insert(pendingRows);

    if (logStartError) {
      console.error("Unable to start quote delivery log:", logStartError);
      return NextResponse.json(
        { ok: false, error: "Unable to start the quote delivery log; nothing was sent" },
        { status: 500 }
      );
    }

    const results: QuoteDeliveryResult[] = await Promise.all([
      sendQuoteEmail({
        customer_first_name: quote.customer_first_name,
        customer_email: quote.customer_email,
        copy_email: copyEmail,
        quote_number: quote.quote_number,
        total: quote.total,
        public_token: quote.public_token,
        expires_at: expiresAt,
      }),
      sendQuoteSms({
        customer_first_name: quote.customer_first_name,
        customer_phone: quote.customer_phone,
        public_token: quote.public_token,
        expires_at: expiresAt,
        quote_number: quote.quote_number,
        total: quote.total,
        line_items: quote.line_items,
        notes_internal: quote.notes_internal,
      }),
    ]);

    const completedAt = new Date().toISOString();
    const { error: logFinishError } = await supabase
      .from("quote_delivery_events")
      .upsert(
        results.map((result) => ({
          quote_id: id,
          attempt_id: attemptId,
          channel: result.channel,
          provider: result.provider,
          recipient: result.recipient,
          copy_recipient: result.copyRecipient,
          status: result.status,
          provider_message_id: result.providerMessageId,
          provider_status: result.providerStatus,
          error: result.error,
          completed_at: completedAt,
        })),
        { onConflict: "attempt_id,channel" }
      );

    if (logFinishError) {
      console.error("Unable to finish quote delivery log:", {
        attemptId,
        error: logFinishError,
        results,
      });
    }

    const summary = summarizeQuoteDelivery(results);
    if (!summary.delivered) {
      return NextResponse.json(
        {
          ok: false,
          error: "No customer delivery channel was accepted",
          attemptId,
          deliveries: results,
          auditRecorded: !logFinishError,
        },
        { status: 502 }
      );
    }

    const { data: updated, error: updateErr } = await supabase
      .from("quotes")
      .update({
        status: "sent",
        sent_at: completedAt,
        expires_at: expiresAt,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("Quote was delivered but status update failed:", {
        attemptId,
        error: updateErr,
      });
    }

    await sendPushNotification({
      id: quote.id,
      first_name: `Quote sent: ${quote.quote_number}`,
      last_name: `to ${quote.customer_first_name} ${quote.customer_last_name}`,
      zip: quote.property_zip || "",
      lead_score: quote.total,
      lead_tier: "quote",
    }).catch((pushError) => console.error("Pushover failed:", pushError));

    return NextResponse.json({
      ok: true,
      quote: updated || quote,
      attemptId,
      deliveries: results,
      acceptedChannels: summary.acceptedChannels,
      ownerCopyIncluded: summary.ownerCopyIncluded,
      auditRecorded: !logFinishError,
      statusRecorded: !updateErr,
      ...((logFinishError || updateErr) && {
        warning: "Delivery was accepted, but part of the internal audit update failed",
      }),
    });
  } catch (err) {
    console.error("Quote send error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
