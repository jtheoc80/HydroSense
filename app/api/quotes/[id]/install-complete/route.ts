import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { sendPushover } from "@/lib/pushover-simple";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data: quote } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (!quote) {
      return NextResponse.json({ ok: false, error: "Quote not found" }, { status: 404 });
    }

    if (quote.status !== "deposit_paid" && quote.status !== "install_scheduled") {
      return NextResponse.json(
        { ok: false, error: `Cannot complete install for status '${quote.status}'` },
        { status: 400 }
      );
    }

    if (!quote.stripe_customer_id || !quote.stripe_payment_method_id) {
      return NextResponse.json(
        { ok: false, error: "Missing Stripe payment method — cannot charge balance" },
        { status: 400 }
      );
    }

    const stripe = getStripe();

    // Charge balance off_session
    const balancePI = await stripe.paymentIntents.create({
      amount: quote.balance_amount,
      currency: "usd",
      customer: quote.stripe_customer_id,
      payment_method: quote.stripe_payment_method_id,
      off_session: true,
      confirm: true,
      description: `Install balance: ${quote.quote_number}`,
      metadata: {
        quote_id: quote.id,
        payment_type: "install_balance",
      },
    });

    // End subscription trial — first recurring charge fires now
    if (quote.stripe_subscription_id) {
      await stripe.subscriptions.update(quote.stripe_subscription_id, {
        trial_end: "now",
        proration_behavior: "none",
      });
    }

    // Calculate commitment end date (24 months from now if has_commitment)
    const commitmentEnd = quote.has_commitment
      ? new Date(Date.now() + 24 * 30 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await supabase
      .from("quotes")
      .update({
        balance_charged_at: new Date().toISOString(),
        stripe_balance_payment_intent_id: balancePI.id,
        install_completed_at: new Date().toISOString(),
        commitment_end_date: commitmentEnd,
        status: "install_complete",
      })
      .eq("id", id);

    await sendPushover({
      title: "INSTALL COMPLETE",
      message: `${quote.quote_number} — $${(quote.balance_amount / 100).toFixed(2)} balance charged. ${quote.customer_first_name} ${quote.customer_last_name}. $19/mo Pro now active.`,
    }).catch((err) => console.error("Pushover failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Install complete error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
