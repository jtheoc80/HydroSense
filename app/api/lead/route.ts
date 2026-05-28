import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { leadSchema } from "@/lib/validation";
import { sendLeadNotification } from "@/lib/email";

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

    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...parsed.data,
        ip_address: ip,
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

    const leadWithId = { ...parsed.data, id: data.id, ip_address: ip };

    // Fire side effects in parallel, don't block response
    const sideEffects: Promise<void>[] = [];

    // 1. Email notification
    sideEffects.push(
      sendLeadNotification(leadWithId).catch((err) =>
        console.error("Email notification failed:", err)
      )
    );

    // 2. Webhook
    if (process.env.LEAD_WEBHOOK_URL) {
      sideEffects.push(
        fetch(process.env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadWithId),
        })
          .then(() => undefined)
          .catch((err) => console.error("Webhook failed:", err))
      );
    }

    // Wait for side effects but don't fail the response
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
