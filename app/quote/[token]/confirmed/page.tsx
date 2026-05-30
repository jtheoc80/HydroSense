import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { MASTER_PLUMBER_LICENSE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Deposit Received — HydroSense",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConfirmedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data: quote } = await supabase
    .from("quotes")
    .select("*")
    .eq("public_token", token)
    .single();

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#001A4E] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F8FAFC] text-xl mb-2">Quote not found</p>
          <p className="text-[#9AA8BF] text-sm">
            This link may have expired or is invalid.
          </p>
        </div>
      </div>
    );
  }

  const depositDisplay = quote.deposit_amount
    ? `$${(quote.deposit_amount / 100).toFixed(2)}`
    : `$${(quote.total / 2).toFixed(2)}`;
  const balanceDisplay = quote.balance_amount
    ? `$${(quote.balance_amount / 100).toFixed(2)}`
    : `$${(quote.total / 2).toFixed(2)}`;

  return (
    <div className="min-h-screen" style={{ background: "#0B1220" }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: 600,
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            background: "#001A4E",
            borderRadius: 16,
            padding: "48px 44px",
            color: "#F8FAFC",
          }}
        >
          {/* Check icon */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "rgba(74, 222, 128, 0.12)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#4ADE80"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1
            className="font-serif"
            style={{
              fontSize: 32,
              fontWeight: 400,
              textAlign: "center",
              color: "#F8FAFC",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            Deposit received. We will schedule your install shortly.
          </h1>

          <p
            className="font-sans"
            style={{
              fontSize: 15,
              lineHeight: 1.65,
              color: "#CBD5E1",
              textAlign: "center",
              margin: "0 0 36px",
              maxWidth: 440,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Your {depositDisplay} deposit is on file. The remaining{" "}
            {balanceDisplay} balance is charged after your install is complete.
            Professional monitoring at $19/month begins on the install date.
            Watch your inbox — your service agreement from PandaDoc is on the
            way.
          </p>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.10)",
              margin: "0 0 28px",
            }}
          />

          {/* Summary */}
          <div style={{ marginBottom: 28 }}>
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9AA8BF",
                marginBottom: 16,
              }}
            >
              Summary
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="font-sans"
                  style={{ fontSize: 14, color: "#9AA8BF" }}
                >
                  Quote
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 14, color: "#F8FAFC" }}
                >
                  {quote.quote_number}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="font-sans"
                  style={{ fontSize: 14, color: "#9AA8BF" }}
                >
                  Deposit paid
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 14, color: "#4ADE80" }}
                >
                  {depositDisplay}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="font-sans"
                  style={{ fontSize: 14, color: "#9AA8BF" }}
                >
                  Balance at install
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 14, color: "#CBD5E1" }}
                >
                  {balanceDisplay}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span
                  className="font-sans"
                  style={{ fontSize: 14, color: "#9AA8BF" }}
                >
                  Monitoring
                </span>
                <span
                  className="font-mono"
                  style={{ fontSize: 14, color: "#CBD5E1" }}
                >
                  $19/mo (starts at install)
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 24,
            }}
          >
            <p
              className="font-sans"
              style={{
                fontSize: 13,
                color: "#6B7A93",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Questions? Call{" "}
              <a
                href="tel:+12816945754"
                style={{ color: "#38BDF8", textDecoration: "none" }}
              >
                (281) 694-5754
              </a>{" "}
              or reply to the email confirmation.
              <br />
              HydroSense Texas — {MASTER_PLUMBER_LICENSE}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
