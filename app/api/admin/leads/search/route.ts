import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ leads: [] });
  }

  // Search by name, email, or phone
  const { data, error } = await supabase
    .from("leads")
    .select(
      "id, first_name, last_name, email, phone, address, zip, carrier, power_within_12ft, fire_sprinkler_system, wifi_at_install_location"
    )
    .or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    return NextResponse.json({ leads: [] });
  }

  return NextResponse.json({ leads: data || [] });
}
