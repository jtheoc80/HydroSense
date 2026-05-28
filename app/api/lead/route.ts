import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotification, sendLeadConfirmation } from "@/lib/email";
import { sendInstantSms } from "@/lib/twilio";
import { sendPushNotification } from "@/lib/pushover";
import { scoreLead } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";

    // Score the lead before insert
    const { score, tier, factors } = scoreLead(parsed.data);

    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...parsed.data,
        ip_address: ip,
        lead_score: score,
        lead_tier: tier,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { ok: false, error: "Failed to save lead" },
        { status: 500 }
      );
    }

    const leadWithId = {
      ...parsed.data,
      id: data.id,
      ip_address: ip,
      lead_score: score,
      lead_tier: tier,
    };

    // Build webhook payload with scoring data
    const webhookPayload = {
      ...leadWithId,
      lead_score: score,
      lead_tier: tier,
      lead_factors: factors,
      submitted_at: new Date().toISOString(),
      booking_url: process.env.NEXT_PUBLIC_BOOKING_URL || null,
    };

    // Fire ALL side effects in parallel. Each wrapped in try/catch.
    // SMS is the highest-priority item (speed to lead).
    const sideEffects: Promise<void>[] = [];

    // 1. Instant SMS (highest priority, 10-30 second window target)
    sideEffects.push(
      sendInstantSms(parsed.data).catch((err) =>
        console.error("Twilio SMS failed:", err)
      )
    );

    // 2. Confirmation email to lead (with booking link + savings)
    sideEffects.push(
      sendLeadConfirmation(leadWithId).catch((err) =>
        console.error("Confirmation email failed:", err)
      )
    );

    // 3. Notification email to founder
    sideEffects.push(
      sendLeadNotification(leadWithId).catch((err) =>
        console.error("Email notification failed:", err)
      )
    );

    // 4. Push notification to founder's phone
    sideEffects.push(
      sendPushNotification(leadWithId).catch((err) =>
        console.error("Pushover notification failed:", err)
      )
    );

    // 5. Automation webhook (n8n / Zapier / HubSpot)
    if (process.env.LEAD_AUTOMATION_WEBHOOK) {
      sideEffects.push(
        fetch(process.env.LEAD_AUTOMATION_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        })
          .then(() => undefined)
          .catch((err) => console.error("Automation webhook failed:", err))
      );
    }

    // 6. Legacy webhook (backwards compatible)
    if (
      process.env.LEAD_WEBHOOK_URL &&
      process.env.LEAD_WEBHOOK_URL !== process.env.LEAD_AUTOMATION_WEBHOOK
    ) {
      sideEffects.push(
        fetch(process.env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(webhookPayload),
        })
          .then(() => undefined)
          .catch((err) => console.error("Legacy webhook failed:", err))
      );
    }

    // Do not await before returning success. Fire and forget.
    Promise.allSettled(sideEffects);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
