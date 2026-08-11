"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quote, LineItem } from "./types";

const carriers = [
  "State Farm", "USAA", "Allstate", "Farmers", "Travelers",
  "Liberty Mutual", "Nationwide", "Progressive", "Texas Farm Bureau",
  "Chubb", "Other", "Not sure",
];

interface LeadOption {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  zip: string;
  carrier: string | null;
  power_within_12ft: string | null;
  fire_sprinkler_system: string | null;
  wifi_at_install_location: string | null;
}

const SUGGESTED_ADDONS: {
  condition: (lead: LeadOption) => boolean;
  sku: string;
  name: string;
  description: string;
  price: number;
}[] = [
  {
    condition: (l) => l.power_within_12ft === "no",
    sku: "INST-ELEC",
    name: "Electrical outlet install",
    description: "110V outlet within 12ft of main shutoff",
    price: 275,
  },
  {
    condition: (l) => l.fire_sprinkler_system === "yes",
    sku: "INST-SPRINK",
    name: "Sprinkler bypass install",
    description: "Shutoff routed around fire sprinkler system",
    price: 350,
  },
  {
    condition: (l) => l.wifi_at_install_location === "no",
    sku: "ADD-WIFI",
    name: "WiFi extender",
    description: "WiFi range extender for shutoff location",
    price: 89,
  },
];

function emptyLineItem(): LineItem {
  return { sku: "", name: "", description: "", quantity: 1, unit_price: 0, line_total: 0 };
}

interface QuoteFormProps {
  existing?: Quote;
  mode: "new" | "edit";
}

export default function QuoteFormClient({ existing, mode }: QuoteFormProps) {
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // Customer fields
  const [leadId, setLeadId] = useState(existing?.lead_id || "");
  const [firstName, setFirstName] = useState(existing?.customer_first_name || "");
  const [lastName, setLastName] = useState(existing?.customer_last_name || "");
  const [email, setEmail] = useState(existing?.customer_email || "");
  const [phone, setPhone] = useState(existing?.customer_phone || "");
  const [address, setAddress] = useState(existing?.property_address || "");
  const [city, setCity] = useState(existing?.property_city || "");
  const [zip, setZip] = useState(existing?.property_zip || "");
  const [carrier, setCarrier] = useState(existing?.carrier || "");

  // Carrier credit
  const [premiumEstimate, setPremiumEstimate] = useState(existing?.carrier_premium_estimate ?? 4500);
  const [discountPct, setDiscountPct] = useState(existing?.carrier_discount_pct ?? 10);
  const [waterPortionPct, setWaterPortionPct] = useState(existing?.carrier_water_portion_pct ?? 0.1);

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>(
    existing?.line_items?.length ? existing.line_items : [emptyLineItem()]
  );

  // Notes
  const [notesCustomer, setNotesCustomer] = useState(existing?.notes_customer || "");
  const [notesInternal, setNotesInternal] = useState(existing?.notes_internal || "");

  // Lead search
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<LeadOption[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadOption | null>(null);
  const [showLeadResults, setShowLeadResults] = useState(false);

  // Computed
  const annualEstimate = premiumEstimate * waterPortionPct * (discountPct / 100);
  const subtotal = lineItems.reduce((sum, li) => sum + li.line_total, 0);
  const total = subtotal;

  // Lead search with debounce
  const searchLeads = useCallback(async (q: string) => {
    if (q.length < 2) {
      setLeadResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/admin/leads/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = await res.json();
        setLeadResults(json.leads || []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchLeads(leadSearch), 300);
    return () => clearTimeout(timer);
  }, [leadSearch, searchLeads]);

  function selectLead(lead: LeadOption) {
    setSelectedLead(lead);
    setLeadId(lead.id);
    setFirstName(lead.first_name);
    setLastName(lead.last_name);
    setEmail(lead.email);
    setPhone(lead.phone || "");
    setAddress(lead.address || "");
    setZip(lead.zip);
    setCarrier(lead.carrier || "");
    setShowLeadResults(false);
    setLeadSearch(`${lead.first_name} ${lead.last_name}`);
  }

  function addSuggestedAddon(addon: typeof SUGGESTED_ADDONS[0]) {
    if (lineItems.some((li) => li.sku === addon.sku)) return;
    setLineItems((prev) => [
      ...prev.filter((li) => li.sku || li.name),
      {
        sku: addon.sku,
        name: addon.name,
        description: addon.description,
        quantity: 1,
        unit_price: addon.price,
        line_total: addon.price,
      },
    ]);
  }

  function updateLineItem(index: number, field: keyof LineItem, value: string | number) {
    setLineItems((prev) => {
      const next = [...prev];
      const item = { ...next[index], [field]: value };
      item.line_total = item.quantity * item.unit_price;
      next[index] = item;
      return next;
    });
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => prev.filter((_, i) => i !== index));
  }

  function addLineItem() {
    setLineItems((prev) => [...prev, emptyLineItem()]);
  }

  function buildPayload() {
    return {
      lead_id: leadId || null,
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_email: email,
      customer_phone: phone || null,
      property_address: address || null,
      property_city: city || null,
      property_zip: zip || null,
      carrier: carrier || null,
      carrier_premium_estimate: premiumEstimate,
      carrier_discount_pct: discountPct,
      carrier_water_portion_pct: waterPortionPct,
      carrier_annual_estimate: annualEstimate,
      line_items: lineItems.filter((li) => li.name),
      subtotal,
      total,
      notes_customer: notesCustomer || null,
      notes_internal: notesInternal || null,
    };
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const payload = buildPayload();
      const url = mode === "edit" ? `/api/quotes/${existing!.id}` : "/api/quotes";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.ok) {
        setMessage(`Error: ${json.error}`);
      } else {
        if (mode === "new") {
          window.location.href = `/admin/quotes/${json.quote.id}`;
        } else {
          setMessage("Quote saved.");
        }
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSend() {
    if (!existing?.id) return;
    setSending(true);
    setMessage("");
    try {
      const res = await fetch(`/api/quotes/${existing.id}/send`, { method: "POST" });
      const json = await res.json();
      if (!json.ok) {
        setMessage(`Send error: ${json.error}`);
      } else {
        setMessage("Quote sent to customer.");
        window.location.reload();
      }
    } catch {
      setMessage("Network error.");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusUpdate(status: string) {
    if (!existing?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/quotes/${existing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // For non-draft status updates, use a direct supabase update pattern
      // For now, reload to reflect
      if (res.ok) window.location.reload();
    } finally {
      setSaving(false);
    }
  }

  const isDraft = !existing || existing.status === "draft";
  const suggestions = selectedLead
    ? SUGGESTED_ADDONS.filter((a) => a.condition(selectedLead))
    : [];

  return (
    <div className="min-h-screen bg-ink-950 text-fog-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-1">
          <a href="/admin/quotes" className="text-xs text-fog-400 hover:text-fog-200 transition-colors">
            Quotes
          </a>
          <span className="text-fog-400">/</span>
          <span className="text-xs text-fog-200">
            {mode === "new" ? "New Quote" : existing?.quote_number}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-fog-50 mb-8">
          {mode === "new" ? "New Quote" : `Edit ${existing?.quote_number}`}
        </h1>

        {/* Status bar for existing quotes */}
        {existing && (
          <div className="flex items-center gap-3 mb-8 p-4 bg-ink-900 rounded-xl border border-white/10">
            <span className="text-xs text-fog-400 uppercase tracking-wider">Status:</span>
            <span className={`px-2.5 py-1 rounded text-xs font-medium ${
              {
                draft: "bg-fog-400/20 text-fog-400",
                sent: "bg-hydro-400/20 text-hydro-400",
                viewed: "bg-signal-400/20 text-signal-400",
                accepted: "bg-green-500/20 text-green-400",
                declined: "bg-red-500/20 text-red-400",
                expired: "bg-fog-400/15 text-fog-300",
                deposit_paid: "bg-green-500/20 text-green-300",
                install_scheduled: "bg-hydro-400/20 text-hydro-300",
                install_complete: "bg-green-500/20 text-green-300",
                deposit_refunded: "bg-signal-400/20 text-signal-400",
                canceled: "bg-red-500/20 text-red-300",
              }[existing.status]
            }`}>
              {existing.status}
            </span>
            {existing.sent_at && (
              <span className="text-xs text-fog-400">
                Sent {new Date(existing.sent_at).toLocaleDateString()}
              </span>
            )}
            {existing.viewed_at && (
              <span className="text-xs text-signal-400">
                Viewed {new Date(existing.viewed_at).toLocaleDateString()}
              </span>
            )}
            {(existing.status === "sent" || existing.status === "viewed") && (
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => handleStatusUpdate("accepted")}
                  className="text-xs px-3 py-1.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  Mark accepted
                </button>
                <button
                  onClick={() => handleStatusUpdate("declined")}
                  className="text-xs px-3 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Mark declined
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {/* Lead lookup */}
          <section className="space-y-4">
            <h2 className="text-sm text-fog-400 uppercase tracking-wider font-medium">Customer</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={leadSearch}
                onChange={(e) => {
                  setLeadSearch(e.target.value);
                  setShowLeadResults(true);
                }}
                onFocus={() => setShowLeadResults(true)}
                className="w-full bg-ink-900 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-fog-50 placeholder:text-fog-400 focus:border-hydro-400 focus:outline-none"
              />
              {showLeadResults && leadResults.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-ink-800 border border-white/15 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {leadResults.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => selectLead(lead)}
                      className="w-full text-left px-4 py-3 hover:bg-ink-700 transition-colors border-b border-white/6 last:border-0"
                    >
                      <div className="text-sm text-fog-50">
                        {lead.first_name} {lead.last_name}
                      </div>
                      <div className="text-xs text-fog-400">
                        {lead.email} {lead.phone ? `/ ${lead.phone}` : ""}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Suggested addons from qualifying answers */}
            {suggestions.length > 0 && (
              <div className="p-4 bg-signal-400/6 border border-signal-400/20 rounded-lg">
                <p className="text-xs text-signal-400 font-medium uppercase tracking-wider mb-3">
                  Suggested add-ons based on intake
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((addon) => (
                    <button
                      key={addon.sku}
                      onClick={() => addSuggestedAddon(addon)}
                      disabled={lineItems.some((li) => li.sku === addon.sku)}
                      className="text-xs px-3 py-2 rounded-lg border border-signal-400/40 text-signal-400 hover:bg-signal-400/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + {addon.sku} ({addon.name}, ${addon.price})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-fog-400 mb-1">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-fog-400 mb-1">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-fog-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-fog-400 mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-fog-400 mb-1">Property address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isDraft}
                className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-fog-400 mb-1">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-fog-400 mb-1">ZIP</label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Carrier credit */}
          <section className="space-y-4">
            <h2 className="text-sm text-fog-400 uppercase tracking-wider font-medium">Insurance credit</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-fog-400 mb-1">Carrier</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                >
                  <option value="">Select carrier</option>
                  {carriers.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-fog-400 mb-1">Annual premium estimate ($)</label>
                <input
                  type="number"
                  value={premiumEstimate}
                  onChange={(e) => setPremiumEstimate(Number(e.target.value))}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-fog-400 mb-1">Discount (%)</label>
                <input
                  type="number"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Number(e.target.value))}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-xs text-fog-400 mb-1">Water portion (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={waterPortionPct}
                  onChange={(e) => setWaterPortionPct(Number(e.target.value))}
                  disabled={!isDraft}
                  className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            <div className="p-4 bg-signal-400/6 border-l-2 border-signal-400 rounded-r-lg">
              <p className="text-xs text-fog-400 mb-1">Estimated annual credit</p>
              <p className="font-mono text-2xl text-signal-400">
                ${Math.round(annualEstimate).toLocaleString()}/yr
              </p>
            </div>
          </section>

          {/* Line items */}
          <section className="space-y-4">
            <h2 className="text-sm text-fog-400 uppercase tracking-wider font-medium">Line items</h2>
            <div className="space-y-3">
              {lineItems.map((li, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-2">
                    <label className="block text-xs text-fog-400 mb-1">SKU</label>
                    <input
                      value={li.sku}
                      onChange={(e) => updateLineItem(i, "sku", e.target.value)}
                      disabled={!isDraft}
                      className="w-full bg-ink-900 border border-white/15 rounded-lg px-2 py-2 text-xs text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-fog-400 mb-1">Name</label>
                    <input
                      value={li.name}
                      onChange={(e) => updateLineItem(i, "name", e.target.value)}
                      disabled={!isDraft}
                      className="w-full bg-ink-900 border border-white/15 rounded-lg px-2 py-2 text-xs text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs text-fog-400 mb-1">Description</label>
                    <input
                      value={li.description}
                      onChange={(e) => updateLineItem(i, "description", e.target.value)}
                      disabled={!isDraft}
                      className="w-full bg-ink-900 border border-white/15 rounded-lg px-2 py-2 text-xs text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-fog-400 mb-1">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={li.quantity}
                      onChange={(e) => updateLineItem(i, "quantity", Number(e.target.value))}
                      disabled={!isDraft}
                      className="w-full bg-ink-900 border border-white/15 rounded-lg px-2 py-2 text-xs text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs text-fog-400 mb-1">Price</label>
                    <input
                      type="number"
                      value={li.unit_price}
                      onChange={(e) => updateLineItem(i, "unit_price", Number(e.target.value))}
                      disabled={!isDraft}
                      className="w-full bg-ink-900 border border-white/15 rounded-lg px-2 py-2 text-xs text-fog-50 font-mono focus:border-hydro-400 focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <label className="block text-xs text-fog-400 mb-1">Total</label>
                    <p className="py-2 text-xs font-mono text-fog-50">
                      ${li.line_total.toLocaleString()}
                    </p>
                  </div>
                  <div className="col-span-1">
                    {isDraft && (
                      <button
                        onClick={() => removeLineItem(i)}
                        className="text-xs text-red-400 hover:text-red-300 py-2 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isDraft && (
              <button
                onClick={addLineItem}
                className="text-xs text-hydro-400 hover:text-hydro-300 transition-colors"
              >
                + Add line item
              </button>
            )}
            <div className="flex justify-end pt-4 border-t border-white/10">
              <div className="text-right">
                <p className="text-xs text-fog-400 mb-1">Total today</p>
                <p className="font-mono text-3xl text-fog-50">
                  ${total.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-4">
            <h2 className="text-sm text-fog-400 uppercase tracking-wider font-medium">Notes</h2>
            <div>
              <label className="block text-xs text-fog-400 mb-1">Note for customer (shown on quote)</label>
              <textarea
                value={notesCustomer}
                onChange={(e) => setNotesCustomer(e.target.value)}
                rows={3}
                disabled={!isDraft}
                className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-xs text-fog-400 mb-1">Internal note (not shown to customer)</label>
              <textarea
                value={notesInternal}
                onChange={(e) => setNotesInternal(e.target.value)}
                rows={2}
                className="w-full bg-ink-900 border border-white/15 rounded-lg px-3 py-2 text-sm text-fog-50 focus:border-hydro-400 focus:outline-none"
              />
            </div>
          </section>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            {isDraft && (
              <button
                onClick={handleSave}
                disabled={saving || !firstName || !lastName}
                className="px-6 py-2.5 rounded-lg bg-ink-800 border border-white/15 text-sm text-fog-50 font-medium hover:border-white/25 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save draft"}
              </button>
            )}
            {mode === "edit" && isDraft && (
              <button
                onClick={handleSend}
                disabled={sending || !firstName}
                className="px-6 py-2.5 rounded-lg bg-hydro-400 text-ink-950 text-sm font-semibold hover:bg-hydro-300 transition-colors disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send quote"}
              </button>
            )}
            {mode === "edit" && existing?.status === "sent" && (
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2.5 rounded-lg bg-hydro-400 text-ink-950 text-sm font-semibold hover:bg-hydro-300 transition-colors disabled:opacity-50"
              >
                {sending ? "Resending..." : "Resend quote"}
              </button>
            )}
            {message && (
              <p className={`text-sm ${message.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
