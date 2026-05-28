import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const id = form.get("id") as string;
  const status = form.get("status") as string;

  if (!id || !status) {
    return NextResponse.json(
      { ok: false, error: "Missing id or status" },
      { status: 400 }
    );
  }

  const validStatuses = [
    "new",
    "booked",
    "showed",
    "quoted",
    "won",
    "lost",
  ];
  if (!validStatuses.includes(status)) {
    return NextResponse.json(
      { ok: false, error: "Invalid status" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
