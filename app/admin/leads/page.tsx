import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface Lead {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  zip: string;
  address: string | null;
  carrier: string | null;
  message: string | null;
  source: string;
  status: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

const statuses = ["new", "contacted", "quoted", "won", "lost"];

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await supabase.from("leads").update({ status }).eq("id", id);
  revalidatePath("/admin/leads");
}

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return (
      <div className="min-h-screen bg-ink-900 p-8">
        <p className="text-alert-400">Error loading leads: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-fog-50">HydroSense Leads</h1>
          <p className="text-sm text-fog-300">{leads?.length || 0} leads</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-700">
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Date</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Name</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Email</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Phone</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">ZIP</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Carrier</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Source</th>
                <th className="text-left py-3 px-3 text-fog-300 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(leads as Lead[])?.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-800 hover:bg-ink-800/50">
                  <td className="py-3 px-3 text-fog-300 whitespace-nowrap font-mono text-xs">
                    {new Date(lead.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-3 text-fog-50 whitespace-nowrap">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="py-3 px-3 text-fog-200">
                    <a href={`mailto:${lead.email}`} className="hover:text-hydro-400 transition-colors">
                      {lead.email}
                    </a>
                  </td>
                  <td className="py-3 px-3 text-fog-300 whitespace-nowrap">
                    {lead.phone || "-"}
                  </td>
                  <td className="py-3 px-3 text-fog-300 font-mono">{lead.zip}</td>
                  <td className="py-3 px-3 text-fog-300">{lead.carrier || "-"}</td>
                  <td className="py-3 px-3 text-fog-300 text-xs">
                    {lead.utm_source || lead.source}
                  </td>
                  <td className="py-3 px-3">
                    <form action={updateStatus}>
                      <input type="hidden" name="id" value={lead.id} />
                      <select
                        name="status"
                        defaultValue={lead.status}
                        onChange={(e) => {
                          const form = e.target.closest("form");
                          if (form) form.requestSubmit();
                        }}
                        className="bg-ink-800 border border-ink-700 rounded px-2 py-1 text-xs text-fog-200 focus:outline-none focus:ring-1 focus:ring-hydro-400"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </form>
                  </td>
                </tr>
              ))}
              {(!leads || leads.length === 0) && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-fog-300">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
