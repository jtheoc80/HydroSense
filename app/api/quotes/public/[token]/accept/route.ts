import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getStripe, getSubscriptionSku } from "@/lib/stripe";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("public_token", token)
      .single();

    if (!quote) {
      return NextResponse.json(
        { ok: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    // Already paid — no-op
    if (quote.status === "deposit_paid" || quote.status === "install_complete") {
      return NextResponse.json({ ok: true, already: true });
    }

    // Already accepted but not yet paid — re-create checkout session
    if (
      quote.status !== "sent" &&
      quote.status !== "viewed" &&
      quote.status !== "accepted"
    ) {
      return NextResponse.json(
        { ok: false, error: `Cannot accept quote with status '${quote.status}'` },
        { status: 400 }
      );
    }

    // Check expiration
    if (quote.expires_at && new Date(quote.expires_at) < new Date()) {
      await supabase
        .from("quotes")
        .update({ status: "expired" })
        .eq("id", quote.id);
      return NextResponse.json(
        { ok: false, error: "This quote has expired" },
        { status: 410 }
      );
    }

    // Calculate deposit (use stored value or compute 50/50)
    const depositAmount =
      quote.deposit_amount ?? Math.round((quote.total / 2) * 100);
    const balanceAmount =
      quote.balance_amount ?? Math.round(quote.total * 100) - depositAmount;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://hydrosensetx.com";

    const stripe = getStripe();
    const subSku = getSubscriptionSku(quote.line_items ?? []);

    const serviceAddress = [
      quote.property_address,
      quote.property_city,
      quote.property_zip,
    ]
      .filter(Boolean)
      .join(", ");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: quote.customer_email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Install deposit — HydroSense ${quote.quote_number}`,
              description: `50% deposit for smart water shutoff install${serviceAddress ? ` at ${serviceAddress}` : ""}. Balance of $${(balanceAmount / 100).toFixed(2)} due at install completion. Professional monitoring at $19/month begins on install date.`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
        description: `Deposit: ${quote.quote_number}`,
        metadata: {
          quote_id: quote.id,
          quote_number: quote.quote_number,
          payment_type: "install_deposit",
          lead_id: quote.lead_id || "",
        },
      },
      metadata: {
        quote_id: quote.id,
        quote_number: quote.quote_number,
        subscription_sku: subSku || "",
        has_commitment: quote.has_commitment ? "true" : "false",
        commitment_months: (quote.commitment_months ?? 0).toString(),
      },
      success_url: `${siteUrl}/quote/${token}/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/quote/${token}`,
    });

    // Mark accepted and save checkout session ID
    await supabase
      .from("quotes")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        stripe_checkout_session_id: session.id,
        deposit_amount: depositAmount,
        balance_amount: balanceAmount,
      })
      .eq("id", quote.id);

    return NextResponse.json({ ok: true, redirect: session.url });
  } catch (err) {
    console.error("Quote accept error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
