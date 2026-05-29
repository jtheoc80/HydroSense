import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
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
