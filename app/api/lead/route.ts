import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotification, sendLeadConfirmation } from "@/lib/email";
import { sendInstantSms } from "@/lib/twilio";
import { sendPushNotification } from "@/lib/pushover";
import { postWebhook } from "@/lib/webhook";
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

    const userAgent = request.headers.get("user-agent") || "";

    // Score the lead before insert
    const { score, tier, factors, qualifying_flags } = scoreLead(parsed.data);

    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...parsed.data,
        user_agent: parsed.data.user_agent || userAgent,
        ip_address: ip,
        lead_score: score,
        lead_tier: tier,
        qualifying_flags,
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
      qualifying_flags,
    };

    const webhookPayload = {
      ...leadWithId,
      lead_factors: factors,
      qualifying_flags,
      submitted_at: new Date().toISOString(),
      booking_url: process.env.NEXT_PUBLIC_BOOKING_URL || null,
    };

    // Await all side effects — Vercel terminates after response,
    // so fire-and-forget would lose in-flight requests.
    // allSettled ensures one failure does not block the others.
    const results = await Promise.allSettled([
      sendInstantSms(parsed.data).catch((err) =>
        console.error("Twilio SMS failed:", err)
      ),
      sendLeadConfirmation(leadWithId).catch((err) =>
        console.error("Confirmation email failed:", err)
      ),
      sendLeadNotification(leadWithId).catch((err) =>
        console.error("Email notification failed:", err)
      ),
      sendPushNotification(leadWithId).catch((err) =>
        console.error("Pushover notification failed:", err)
      ),
      postWebhook(webhookPayload).catch((err) =>
        console.error("Webhook failed:", err)
      ),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.warn(`${failed.length} side effect(s) rejected`);
    }

    return NextResponse.json({ ok: true, id: data.id, lead_score: score });
  } catch (err) {
    console.error("Lead API error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
