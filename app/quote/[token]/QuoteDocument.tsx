"use client";

import { useState } from "react";

interface LineItem {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface QuoteData {
  id: string;
  quote_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  property_address: string | null;
  property_city: string | null;
  property_zip: string | null;
  carrier: string | null;
  carrier_premium_estimate: number | null;
  carrier_discount_pct: number | null;
  carrier_water_portion_pct: number | null;
  carrier_annual_estimate: number | null;
  line_items: LineItem[];
  subtotal: number;
  total: number;
  notes_customer: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
  accepted_at: string | null;
}

function HydroMark() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5C12 2.5 4.5 11 4.5 16.5C4.5 19.5 8 22 12 22C16 22 19.5 19.5 19.5 16.5C19.5 11 12 2.5 12 2.5Z"
        fill="#38BDF8"
        opacity="0.95"
      />
      <path
        d="M9 14C9 17 11 18.5 13 18"
        stroke="#F8FAFC"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      />
    </svg>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Subscription SKU prefix — any line item starting with SUB- is treated as an optional subscription add-on
const SUB_SKU_PREFIX = "SUB-";
const SUBSCRIPTION_DISCOUNT = 100;

export default function QuoteDocument({
  quote,
  token,
  isExpired,
  isActionable,
  mpl,
}: {
  quote: QuoteData;
  token: string;
  isExpired: boolean;
  isActionable: boolean;
  mpl: string;
}) {
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [accepted, setAccepted] = useState(quote.status === "accepted");
  const [declined, setDeclined] = useState(quote.status === "declined");

  // Separate install line items from subscription add-ons
  const installItems = quote.line_items.filter(
    (li) => !li.sku.startsWith(SUB_SKU_PREFIX)
  );
  const subscriptionItem = quote.line_items.find((li) =>
    li.sku.startsWith(SUB_SKU_PREFIX)
  );

  // Subscription toggle — default ON (opt-out model)
  const [subSelected, setSubSelected] = useState(true);

  const baseTotal = quote.total; // stored as full install price (e.g. 899)
  const discountedTotal = subscriptionItem
    ? baseTotal - SUBSCRIPTION_DISCOUNT
    : baseTotal;
  const displayTotal = subscriptionItem && subSelected ? discountedTotal : baseTotal;

  const annualCredit = quote.carrier_annual_estimate
    ? Math.round(quote.carrier_annual_estimate)
    : null;
  const paybackMonths =
    annualCredit && annualCredit > 0
      ? Math.ceil((displayTotal / annualCredit) * 12)
      : null;
  const fiveYearCredit = annualCredit ? annualCredit * 5 : null;

  const expiresDate = quote.expires_at ? formatDate(quote.expires_at) : null;

  async function handleAccept() {
    setAccepting(true);
    try {
      const res = await fetch(`/api/quotes/public/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription_selected: !!subscriptionItem && subSelected,
          accepted_total: displayTotal,
        }),
      });
      const json = await res.json();
      if (json.ok || json.already) {
        setAccepted(true);
      }
    } catch {
      // Silently fail
    } finally {
      setAccepting(false);
    }
  }

  async function handleDecline() {
    if (!confirm("Are you sure you want to decline this quote?")) return;
    setDeclining(true);
    try {
      const res = await fetch(`/api/quotes/public/${token}/decline`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.ok || json.already) {
        setDeclined(true);
      }
    } catch {
      // Silently fail
    } finally {
      setDeclining(false);
    }
  }

  return (
    <>
      <style>{`
        @media print {
          .quote-outer { background: white !important; padding: 0 !important; }
          .quote-doc { max-width: none !important; margin: 0 !important; padding: 32px !important; }
          .quote-accept-block, .quote-decline-block { display: none !important; }
        }
      `}</style>

      <div className="quote-outer min-h-screen" style={{ background: "#0B1220", padding: "32px 16px" }}>
        <div
          className="quote-doc mx-auto"
          style={{
            maxWidth: 600,
            background: "#001A4E",
            borderRadius: 16,
            padding: "44px 44px 36px",
            color: "#F8FAFC",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <HydroMark />
              <div>
                <div
                  className="font-mono"
                  style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF" }}
                >
                  HydroSense
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7A93" }}
                >
                  Texas
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="font-mono" style={{ fontSize: 12, color: "#9AA8BF" }}>
                {quote.quote_number}
              </div>
              {expiresDate && (
                <div className="font-mono" style={{ fontSize: 11, color: "#6B7A93", marginTop: 2 }}>
                  Valid through {expiresDate}
                </div>
              )}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  background: "rgba(56,189,248,0.08)",
                  border: "1px solid rgba(56,189,248,0.20)",
                  borderRadius: 6,
                  padding: "4px 10px",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#38BDF8" opacity="0.9" />
                </svg>
                <span className="font-mono" style={{ fontSize: 10, color: "#7DD3FC", letterSpacing: "0.05em" }}>
                  TX Master Plumber{" "}<span style={{ fontWeight: 600 }}>{mpl}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div
              className="font-mono"
              style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 8 }}
            >
              Quote for
            </div>
            <h1
              className="font-serif"
              style={{ fontSize: 46, lineHeight: 1.08, fontWeight: 400, color: "#F8FAFC", margin: 0 }}
            >
              {quote.customer_first_name} {quote.customer_last_name}
            </h1>
            {(quote.property_address || quote.property_city) && (
              <p className="font-sans" style={{ fontSize: 15, color: "#CBD5E1", marginTop: 8 }}>
                {[quote.property_address, quote.property_city, quote.property_zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", marginBottom: 32 }} />

          {/* The work */}
          <div style={{ marginBottom: 36 }}>
            <div
              className="font-mono"
              style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 12 }}
            >
              The work
            </div>
            <p className="font-serif" style={{ fontSize: 19, lineHeight: 1.55, color: "#CBD5E1", margin: 0 }}>
              Professional installation of a certified smart water shutoff on your main water line.
              Licensed plumber, same-week scheduling, carrier-recognized certificate issued after final payment.
              The device monitors flow 24/7, closes the valve within 8 seconds of detecting an anomaly, and sends
              you a phone alert wherever you are.
            </p>
          </div>

          {/* Divider thin */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }} />

          {/* Line items — install services only */}
          <div style={{ marginBottom: 36 }}>
            <div
              className="font-mono"
              style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 16 }}
            >
              Line items
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {installItems.map((li: LineItem, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "12px 0",
                    borderBottom: i < installItems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div className="font-sans" style={{ fontSize: 15, color: "#F8FAFC" }}>
                      {li.name}
                      {li.quantity > 1 && (
                        <span className="font-mono" style={{ fontSize: 12, color: "#9AA8BF", marginLeft: 6 }}>
                          x{li.quantity}
                        </span>
                      )}
                    </div>
                    {li.description && (
                      <div className="font-sans" style={{ fontSize: 13, color: "#9AA8BF", marginTop: 2 }}>
                        {li.description}
                      </div>
                    )}
                  </div>
                  <div className="font-mono" style={{ fontSize: 15, color: "#F8FAFC", marginLeft: 16, whiteSpace: "nowrap" }}>
                    ${formatCurrency(li.line_total)}
                  </div>
                </div>
              ))}
            </div>

            {/* Subscription discount row — only when sub is selected */}
            {subscriptionItem && subSelected && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="font-sans" style={{ fontSize: 15, color: "#4ADE80" }}>
                  Pro monitoring discount
                </div>
                <div className="font-mono" style={{ fontSize: 15, color: "#4ADE80", marginLeft: 16 }}>
                  -${formatCurrency(SUBSCRIPTION_DISCOUNT)}
                </div>
              </div>
            )}

            {/* Total row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 16,
                marginTop: 8,
                borderTop: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9AA8BF" }}
              >
                Total today
              </div>
              <div style={{ textAlign: "right" }}>
                {subscriptionItem && subSelected && (
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 16,
                      color: "#6B7A93",
                      textDecoration: "line-through",
                      marginBottom: 2,
                    }}
                  >
                    ${formatCurrency(baseTotal)}
                  </div>
                )}
                <div className="font-mono" style={{ fontSize: 28, fontWeight: 500, color: "#F8FAFC" }}>
                  ${formatCurrency(displayTotal)}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription opt-in card */}
          {subscriptionItem && isActionable && !accepted && !declined && (
            <div
              style={{
                background: subSelected
                  ? "rgba(74,222,128,0.06)"
                  : "rgba(255,255,255,0.03)",
                border: subSelected
                  ? "1px solid rgba(74,222,128,0.25)"
                  : "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 36,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => setSubSelected(!subSelected)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    {/* Toggle */}
                    <div
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: subSelected ? "#4ADE80" : "#334155",
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          background: "#FFF",
                          position: "absolute",
                          top: 3,
                          left: subSelected ? 23 : 3,
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                        }}
                      />
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: subSelected ? "#4ADE80" : "#9AA8BF",
                      }}
                    >
                      {subSelected ? "Included" : "Add to save $" + SUBSCRIPTION_DISCOUNT}
                    </div>
                  </div>
                  <div className="font-sans" style={{ fontSize: 16, color: "#F8FAFC", fontWeight: 500 }}>
                    {subscriptionItem.name}
                  </div>
                  <div className="font-sans" style={{ fontSize: 13, color: "#9AA8BF", marginTop: 4, lineHeight: 1.5 }}>
                    24/7 leak monitoring, auto-shutoff alerts, insurance certificate renewal, priority service.
                  </div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 16, flexShrink: 0 }}>
                  <div className="font-mono" style={{ fontSize: 20, color: "#F8FAFC", fontWeight: 500 }}>
                    ${subscriptionItem.unit_price}
                  </div>
                  <div className="font-mono" style={{ fontSize: 11, color: "#9AA8BF" }}>/month</div>
                </div>
              </div>
              {subSelected && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "rgba(74,222,128,0.08)",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 12L11 14L15 10" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="10" stroke="#4ADE80" strokeWidth="1.5" opacity="0.4" />
                  </svg>
                  <span className="font-sans" style={{ fontSize: 13, color: "#4ADE80" }}>
                    You save ${SUBSCRIPTION_DISCOUNT} on your install today
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Subscription shown as read-only when not actionable */}
          {subscriptionItem && (!isActionable || accepted || declined) && (
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 36,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="font-sans" style={{ fontSize: 14, color: "#F8FAFC" }}>
                    {subscriptionItem.name}
                  </div>
                  <div className="font-sans" style={{ fontSize: 12, color: "#9AA8BF", marginTop: 2 }}>
                    Included with this quote
                  </div>
                </div>
                <div className="font-mono" style={{ fontSize: 16, color: "#F8FAFC" }}>
                  ${subscriptionItem.unit_price}/mo
                </div>
              </div>
            </div>
          )}

          {/* Insurance credit block */}
          {annualCredit && annualCredit > 0 && (
            <div
              style={{
                background: "rgba(201,168,76,0.06)",
                borderLeft: "2px solid #C9A84C",
                borderRadius: "0 10px 10px 0",
                padding: "24px 24px",
                marginBottom: 36,
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#C9A84C", marginBottom: 12 }}
              >
                Estimated insurance credit
              </div>
              <div className="font-mono" style={{ fontSize: 44, fontWeight: 500, color: "#C9A84C", lineHeight: 1 }}>
                ${formatCurrency(annualCredit)}/yr
              </div>
              {quote.carrier && (
                <div className="font-sans" style={{ fontSize: 13, color: "#9AA8BF", marginTop: 8 }}>
                  Based on {quote.carrier} premium of ${formatCurrency(quote.carrier_premium_estimate || 0)}/yr
                  at {quote.carrier_discount_pct}% water damage credit
                </div>
              )}
              {(paybackMonths || fiveYearCredit) && (
                <div style={{ display: "flex", gap: 32, marginTop: 16 }}>
                  {paybackMonths && (
                    <div>
                      <div className="font-mono" style={{ fontSize: 22, color: "#F8FAFC" }}>
                        {paybackMonths} mo
                      </div>
                      <div className="font-sans" style={{ fontSize: 12, color: "#9AA8BF" }}>
                        Payback on credit alone
                      </div>
                    </div>
                  )}
                  {fiveYearCredit && (
                    <div>
                      <div className="font-mono" style={{ fontSize: 22, color: "#F8FAFC" }}>
                        ${formatCurrency(fiveYearCredit)}
                      </div>
                      <div className="font-sans" style={{ fontSize: 12, color: "#9AA8BF" }}>
                        Five-year cumulative credit
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Customer notes */}
          {quote.notes_customer && (
            <>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }} />
              <div style={{ marginBottom: 36 }}>
                <div
                  className="font-mono"
                  style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 12 }}
                >
                  Note
                </div>
                <p className="font-sans" style={{ fontSize: 15, lineHeight: 1.6, color: "#CBD5E1", margin: 0, whiteSpace: "pre-wrap" }}>
                  {quote.notes_customer}
                </p>
              </div>
            </>
          )}

          {/* Why this works */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }} />
          <div style={{ marginBottom: 36 }}>
            <div
              className="font-mono"
              style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 12 }}
            >
              Why this works
            </div>
            <p className="font-serif" style={{ fontSize: 18, lineHeight: 1.55, color: "#CBD5E1", margin: 0 }}>
              Water damage is the number one homeowner insurance claim in Texas. The device catches abnormal
              flow and closes the valve before the damage starts. The carrier credits the install because it
              removes their highest-frequency claim category from your policy. You pay once, the credit
              renews every year.
            </p>
          </div>

          {/* Signature */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", marginBottom: 32 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
            <div>
              <div
                className="font-mono"
                style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 8 }}
              >
                Prepared by
              </div>
              <div className="font-serif" style={{ fontSize: 22, fontWeight: 400, color: "#F8FAFC" }}>
                Jimmy Theoc
              </div>
              <div className="font-sans" style={{ fontSize: 14, color: "#9AA8BF", marginTop: 4 }}>
                Founder, HydroSense Texas
              </div>
              <div className="font-mono" style={{ fontSize: 12, color: "#6B7A93", marginTop: 4 }}>
                Texas Registered Master Plumber &middot; {mpl}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="font-mono"
                style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 8 }}
              >
                Direct line
              </div>
              <a
                href="tel:+12816945754"
                className="font-mono"
                style={{ fontSize: 15, color: "#F8FAFC", textDecoration: "none" }}
              >
                (281) 694-5754
              </a>
            </div>
          </div>

          {/* About your installer */}
          {isActionable && !accepted && !declined && (
            <div
              style={{
                background: "rgba(56,189,248,0.04)",
                border: "1px solid rgba(56,189,248,0.12)",
                borderRadius: 12,
                padding: "20px 24px",
                marginBottom: 24,
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9AA8BF", marginBottom: 10 }}
              >
                About your installer
              </div>
              <p className="font-sans" style={{ fontSize: 14, lineHeight: 1.6, color: "#CBD5E1", margin: 0 }}>
                Your install is performed by a Texas Registered Master Plumber — license{" "}
                <span className="font-mono" style={{ color: "#7DD3FC", fontWeight: 600 }}>{mpl}</span>.
                Fully insured, background-checked, and certified to issue the carrier-recognized
                installation certificate your insurer requires for the water damage credit.
              </p>
            </div>
          )}

          {/* Accept/Decline block */}
          {accepted && (
            <div
              className="quote-accept-block"
              style={{
                textAlign: "center",
                padding: "24px 0",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 18, color: "#4ADE80", fontWeight: 600 }}>
                Quote accepted
              </div>
              <p style={{ fontSize: 13, color: "#9AA8BF", marginTop: 8 }}>
                We will reach out within one business day with the service agreement.
              </p>
            </div>
          )}

          {declined && (
            <div
              className="quote-decline-block"
              style={{
                textAlign: "center",
                padding: "24px 0",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 16, color: "#9AA8BF" }}>
                Quote declined
              </div>
              <p style={{ fontSize: 13, color: "#6B7A93", marginTop: 8 }}>
                If you change your mind, call (281) 694-5754.
              </p>
            </div>
          )}

          {isExpired && !accepted && !declined && (
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 16, color: "#9AA8BF" }}>
                This quote has expired
              </div>
              <p style={{ fontSize: 13, color: "#6B7A93", marginTop: 8 }}>
                Call (281) 694-5754 to request an updated quote.
              </p>
            </div>
          )}

          {isActionable && !accepted && !declined && (
            <div
              className="quote-accept-block"
              style={{
                textAlign: "center",
                padding: "24px 0",
                borderTop: "1px solid rgba(255,255,255,0.10)",
                marginBottom: 24,
              }}
            >
              <button
                onClick={handleAccept}
                disabled={accepting}
                style={{
                  display: "inline-block",
                  background: "#38BDF8",
                  color: "#001A4E",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  padding: "16px 48px",
                  borderRadius: 10,
                  cursor: accepting ? "wait" : "pointer",
                  opacity: accepting ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {accepting
                  ? "Accepting..."
                  : subscriptionItem && subSelected
                    ? `Accept — $${formatCurrency(displayTotal)} + $${subscriptionItem.unit_price}/mo`
                    : `Accept — $${formatCurrency(displayTotal)}`}
              </button>
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={handleDecline}
                  disabled={declining}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 13,
                    color: "#6B7A93",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  {declining ? "..." : "Decline"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#6B7A93", marginTop: 12, maxWidth: 400, margin: "12px auto 0" }}>
                Accepting confirms your intent to proceed. We will send a service agreement within one business day.
                No payment is collected at this step.
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
            <p style={{ fontSize: 11, color: "#6B7A93", lineHeight: 1.6, margin: 0 }}>
              HydroSense Texas is a service of Lead Ledger Pro LLC. Texas Registered Master Plumber, {mpl}.
              {expiresDate && ` Quote valid through ${expiresDate}.`} Savings estimates are illustrative and
              based on published carrier discount tiers. Actual discount varies by carrier, policy structure,
              and underwriting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
