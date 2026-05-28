"use client";

import { useState } from "react";
import type { Lead } from "./types";

const STATUSES = ["new", "booked", "showed", "quoted", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_COLORS: Record<Status, string> = {
  new: "bg-hydro-400/20 text-hydro-400",
  booked: "bg-blue-500/20 text-blue-400",
  showed: "bg-purple-500/20 text-purple-400",
  quoted: "bg-signal-400/20 text-signal-400",
  won: "bg-green-500/20 text-green-400",
  lost: "bg-fog-400/20 text-fog-400",
};

const SOURCE_FILTERS = [
  { label: "All", value: "" },
  { label: "Homepage", value: "homepage" },
  { label: "City page", value: "city" },
  { label: "Estimator", value: "estimator" },
  { label: "Paid ad", value: "paid" },
];

function getSourceTag(lead: Lead): string {
  if (lead.utm_source && /google|meta|facebook|bing/i.test(lead.utm_source))
    return "paid";
  if (lead.page_path?.includes("/service-area/")) return "city";
  if (lead.page_path?.includes("estimator") || lead.source === "estimator")
    return "estimator";
  return "homepage";
}

export default function AdminLeadsClient({ leads }: { leads: Lead[] }) {
  const [view, setView] = useState<"pipeline" | "table">("pipeline");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const filtered = leads.filter((lead) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        lead.first_name?.toLowerCase().includes(q) ||
        lead.last_name?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.zip?.includes(q) ||
        lead.carrier?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (sourceFilter) {
      if (getSourceTag(lead) !== sourceFilter) return false;
    }
    return true;
  });

  const byStatus = (status: string) =>
    filtered.filter((l) => l.status === status);

  async function moveCard(leadId: string, newStatus: string) {
    const form = new FormData();
    form.set("id", leadId);
    form.set("status", newStatus);

    await fetch("/api/admin/update-status", {
      method: "POST",
      body: form,
    });

    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-ink-900 p-4 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-fog-50">
              HydroSense Leads
            </h1>
            <p className="text-sm text-fog-300">
              {filtered.length} leads
              {search || sourceFilter ? " (filtered)" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("pipeline")}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                view === "pipeline"
                  ? "bg-hydro-400 text-ink-950"
                  : "bg-ink-800 text-fog-300"
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                view === "table"
                  ? "bg-hydro-400 text-ink-950"
                  : "bg-ink-800 text-fog-300"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search name, email, zip, carrier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 bg-ink-800 border border-ink-700 rounded-lg text-fog-50 placeholder-fog-400 text-sm focus:outline-none focus:ring-2 focus:ring-hydro-400 flex-1 max-w-md"
          />
          <div className="flex gap-2 flex-wrap">
            {SOURCE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() =>
                  setSourceFilter(sourceFilter === f.value ? "" : f.value)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  sourceFilter === f.value
                    ? "bg-hydro-400 text-ink-950"
                    : "bg-ink-800 text-fog-300 hover:bg-ink-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {view === "pipeline" ? (
          /* Pipeline view */
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 overflow-x-auto">
            {STATUSES.map((status) => (
              <div key={status} className="min-w-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs uppercase tracking-widest text-fog-400">
                    {status}
                  </h2>
                  <span className="text-xs font-mono text-fog-400">
                    {byStatus(status).length}
                  </span>
                </div>
                <div className="space-y-2">
                  {byStatus(status).map((lead) => (
                    <div
                      key={lead.id}
                      className={`bg-ink-800 border rounded-lg p-3 ${
                        (lead.lead_tier === "hot" || (lead.lead_score ?? 0) >= 3)
                          ? "border-l-4 border-l-signal-400 border-t-ink-700 border-r-ink-700 border-b-ink-700"
                          : "border-ink-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-fog-50 truncate">
                            {lead.first_name} {lead.last_name}
                          </p>
                          <p className="text-xs text-fog-300 truncate">
                            {lead.email}
                          </p>
                        </div>
                        {(lead.lead_tier === "hot" || (lead.lead_score ?? 0) >= 3) && (
                          <span className="shrink-0 text-[10px] font-bold text-signal-400 bg-signal-400/10 px-1.5 py-0.5 rounded">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-fog-400">
                        <span className="font-mono">{lead.zip}</span>
                        {lead.carrier && (
                          <>
                            <span>|</span>
                            <span className="truncate">{lead.carrier}</span>
                          </>
                        )}
                      </div>
                      {lead.city && (
                        <p className="text-xs text-fog-400 mt-1">
                          {lead.city}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-xs text-fog-400">
                        {new Date(lead.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                      {lead.booked_at && (
                        <p className="text-xs text-hydro-400 mt-1">
                          Booked:{" "}
                          {new Date(lead.booked_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
                          )}
                        </p>
                      )}
                      {lead.meeting_url && (
                        <a
                          href={lead.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-hydro-400 hover:text-hydro-300 mt-1 block"
                        >
                          Join meeting
                        </a>
                      )}
                      {/* Status buttons */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {STATUSES.filter((s) => s !== status).map((s) => (
                          <button
                            key={s}
                            onClick={() => moveCard(lead.id, s)}
                            className="text-[10px] px-2 py-0.5 rounded bg-ink-700 text-fog-300 hover:bg-ink-700/80 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {byStatus(status).length === 0 && (
                    <p className="text-xs text-fog-400 text-center py-4">
                      None
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table view */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-700">
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Name
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Email
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Phone
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    ZIP
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Carrier
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    City
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Score
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Source
                  </th>
                  <th className="text-left py-3 px-3 text-fog-300 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-b hover:bg-ink-800/50 ${
                      (lead.lead_tier === "hot" || (lead.lead_score ?? 0) >= 3)
                        ? "border-l-4 border-l-signal-400 border-b-ink-800"
                        : "border-b-ink-800"
                    }`}
                  >
                    <td className="py-3 px-3 text-fog-300 whitespace-nowrap font-mono text-xs">
                      {new Date(lead.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="py-3 px-3 text-fog-50 whitespace-nowrap">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="py-3 px-3 text-fog-200">
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-hydro-400 transition-colors"
                      >
                        {lead.email}
                      </a>
                    </td>
                    <td className="py-3 px-3 text-fog-300 whitespace-nowrap">
                      {lead.phone || "-"}
                    </td>
                    <td className="py-3 px-3 text-fog-300 font-mono">
                      {lead.zip}
                    </td>
                    <td className="py-3 px-3 text-fog-300">
                      {lead.carrier || "-"}
                    </td>
                    <td className="py-3 px-3 text-fog-300 text-xs">
                      {lead.city || "-"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded ${
                          (lead.lead_tier === "hot" || (lead.lead_score ?? 0) >= 3)
                            ? "bg-signal-400/20 text-signal-400"
                            : "text-fog-400"
                        }`}
                      >
                        {lead.lead_score ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-fog-300 text-xs">
                      {getSourceTag(lead)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          STATUS_COLORS[lead.status as Status] ||
                          "bg-ink-700 text-fog-300"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-12 text-center text-fog-300"
                    >
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
