import { supabase } from "@/lib/supabase";
import AdminLeadsClient from "./AdminLeadsClient";
import type { Lead } from "./types";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="min-h-screen bg-ink-900 p-8">
        <p className="text-alert-500">
          Error loading leads: {error.message}
        </p>
      </div>
    );
  }

  return <AdminLeadsClient leads={(leads || []) as Lead[]} />;
}
