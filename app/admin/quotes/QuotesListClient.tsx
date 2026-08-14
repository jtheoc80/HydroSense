"use client";

import { useCallback, useEffect, useState } from "react";
import type { Quote } from "./types";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-fog-400/20 text-fog-400",
  sent: "bg-hydro-400/20 text-hydro-400",
  viewed: "bg-signal-400/20 text-signal-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-red-500/20 text-red-400",
  expired: "bg-fog-400/15 text-fog-300",
};

const STATUSES = ["all", "draft", "sent", "viewed", "accepted", "declined", "expired"] as const;

export default function QuotesListClient({ quotes: initialQuotes }: { quotes: Quote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");
  const [revisingId, setRevisingId] = useState<string | null>(null);

  const refreshQuotes = useCallback(async () => {
    setRefreshing(true);
    setRefreshError("");

    try {
      const response = await fetch("/api/quotes", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const body = (await response.json()) as {
        ok?: boolean;
        quotes?: Quote[];
        error?: string;
      };

      if (!response.ok || !body.ok || !Array.isArray(body.quotes)) {
        throw new Error(body.error || "Unable to refresh quotes");
      }

      setQuotes(body.quotes);
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unable to refresh quotes");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refreshQuotes();

    const onFocus = () => void refreshQuotes();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshQuotes();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refreshQuotes]);

  async function handleRevise(quote: Quote) {
    const confirmed = window.confirm(
      `Create a new editable draft from ${quote.quote_number}? The customer-visible original will remain unchanged.`
    );
    if (!confirmed) return;

    setRevisingId(quote.id);
    setRefreshError("");

    try {
      const response = await fetch(`/api/admin/quotes/${quote.id}/revise`, {
        method: "POST",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const body = (await response.json()) as {
        ok?: boolean;
        quote?: { id?: string };
        error?: string;
      };

      if (!response.ok || !body.ok || !body.quote?.id) {
        throw new Error(body.error || "Unable to create the quote revision");
      }

      window.location.assign(`/admin/quotes/${body.quote.id}`);
    } catch (error) {
      setRefreshError(
        error instanceof Error ? error.message : "Unable to create the quote revision"
      );
      setRevisingId(null);
    }
  }

  const filtered = quotes.filter((q) => {
    if (filter !== "all" && q.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      const name = `${q.customer_first_name} ${q.customer_last_name}`.toLowerCase();
      return (
        name.includes(s) ||
        q.quote_number.toLowerCase().includes(s) ||
        q.customer_email.toLowerCase().includes(s)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ink-950 text-fog-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-4 mb-1">
              <a href="/admin/leads" className="text-xs text-fog-400 hover:text-fog-200 transition-colors">
                Leads
              </a>
              <span className="text-fog-400 font-semibold text-sm">Quotes</span>
            </div>
            <h1 className="text-2xl font-semibold text-fog-50">Quotes</h1>
            <p className="text-sm text-fog-300 mt-1">
              {quotes.length} total{refreshing ? " · Refreshing…" : ""}
            </p>
            {refreshError && (
              <p className="mt-1 text-xs text-red-300" role="alert">
                {refreshError}
              </p>
            )}
          </div>
          <a
            href="/admin/quotes/new"
            className="inline-flex items-center justify-center rounded-lg bg-hydro-400 text-ink-950 font-semibold text-sm px-5 py-2.5 hover:bg-hydro-300 transition-colors"
          >
            New quote
          </a>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search name, email, quote number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-ink-900 border border-white/15 rounded-lg px-4 py-2 text-sm text-fog-50 placeholder:text-fog-400 focus:border-hydro-400 focus:outline-none"
          />
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  filter === s
                    ? "bg-hydro-400/15 border-hydro-400/60 text-hydro-400"
                    : "bg-ink-900 border-white/15 text-fog-300 hover:border-white/25"
                }`}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-fog-400">
            {quotes.length === 0
              ? "No quotes yet. Create your first one."
              : "No quotes match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-fog-400 uppercase tracking-wider border-b border-white/10">
                  <th className="pb-3 pr-4">Quote #</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Total</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-white/6 hover:bg-ink-900/50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <a
                        href={`/admin/quotes/${q.id}`}
                        className="font-mono text-hydro-400 hover:text-hydro-300 transition-colors"
                      >
                        {q.quote_number}
                      </a>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="text-fog-50">
                        {q.customer_first_name} {q.customer_last_name}
                      </div>
                      <div className="text-xs text-fog-400">{q.customer_email}</div>
                    </td>
                    <td className="py-3 pr-4 font-mono text-fog-50">
                      ${Number(q.total).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                          STATUS_COLORS[q.status] || STATUS_COLORS.draft
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-fog-300 text-xs">
                      {new Date(q.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/admin/quotes/${q.id}`}
                          className="text-xs text-fog-300 hover:text-fog-50 transition-colors"
                        >
                          {q.status === "draft" ? "Edit" : "Open"}
                        </a>
                        {q.status !== "draft" && (
                          <button
                            type="button"
                            onClick={() => void handleRevise(q)}
                            disabled={revisingId === q.id}
                            className="text-xs text-signal-300 hover:text-signal-200 transition-colors disabled:opacity-50"
                          >
                            {revisingId === q.id ? "Creating…" : "Revise"}
                          </button>
                        )}
                        {q.status !== "draft" && (
                          <a
                            href={`/quote/${q.public_token}`}
                            target="_blank"
                            rel="noopener"
                            className="text-xs text-hydro-400 hover:text-hydro-300 transition-colors"
                          >
                            View
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
