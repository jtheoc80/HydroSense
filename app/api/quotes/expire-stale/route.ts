import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  }
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("quotes")
      .update({ status: "expired" })
      .in("status", ["sent", "viewed"])
      .lt("expires_at", now)
      .select("id, quote_number");

    if (error) {
      console.error("[expire-stale] error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const count = data?.length ?? 0;
    if (count > 0) {
      console.log(
        `[expire-stale] expired ${count} quotes:`,
        data.map((q) => q.quote_number)
      );
    }

    return NextResponse.json({ ok: true, expired: count });
  } catch (err) {
    console.error("[expire-stale] error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
