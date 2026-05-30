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
        { ok: false, error: `Cannot refund deposit for status '${quote.status}'` },
        { status: 400 }
      );
    }

    if (!quote.stripe_deposit_payment_intent_id) {
      return NextResponse.json(
        { ok: false, error: "No deposit payment intent found" },
        { status: 400 }
      );
    }

    // 48-hour policy enforcement
    if (quote.install_scheduled_date) {
      const installDate = new Date(quote.install_scheduled_date);
      const cutoff = new Date(Date.now() + 48 * 60 * 60 * 1000);
      if (cutoff >= installDate) {
        return NextResponse.json(
          { ok: false, error: "Within 48 hours of install; manual review required" },
          { status: 400 }
        );
      }
    }

    const stripe = getStripe();

    // Refund the deposit
    await stripe.refunds.create({
      payment_intent: quote.stripe_deposit_payment_intent_id,
    });

    // Cancel subscription if exists
    if (quote.stripe_subscription_id) {
      await stripe.subscriptions.cancel(quote.stripe_subscription_id);
    }

    await supabase
      .from("quotes")
      .update({ status: "deposit_refunded" })
      .eq("id", id);

    await sendPushover({
      title: "DEPOSIT REFUNDED",
      message: `${quote.quote_number} — $${(quote.deposit_amount / 100).toFixed(2)} refunded. ${quote.customer_first_name} ${quote.customer_last_name}. Subscription canceled.`,
      priority: 0,
    }).catch((err) => console.error("Pushover failed:", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Refund deposit error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
