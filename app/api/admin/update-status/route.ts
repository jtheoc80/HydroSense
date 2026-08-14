import { NextRequest } from "next/server";
import { parseLeadStatusUpdate } from "@/lib/lead-status";
import { noStoreJson } from "@/lib/site-visits/http";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let input: unknown;

  try {
    if (request.headers.get("content-type")?.includes("application/json")) {
      input = await request.json();
    } else {
      const form = await request.formData();
      input = {
        id: form.get("id"),
        status: form.get("status"),
      };
    }
  } catch {
    return noStoreJson(
      { ok: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  const update = parseLeadStatusUpdate(input);
  if (!update) {
    return noStoreJson(
      { ok: false, error: "A valid lead and outcome are required" },
      { status: 400 }
    );
  }

  const { data: lead, error } = await supabase
    .from("leads")
    .update({ status: update.status })
    .eq("id", update.id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Lead outcome update error:", error);
    return noStoreJson(
      { ok: false, error: "Unable to save the lead outcome" },
      { status: 500 }
    );
  }

  if (!lead) {
    return noStoreJson(
      { ok: false, error: "Lead not found" },
      { status: 404 }
    );
  }

  return noStoreJson({ ok: true, lead });
}
