import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { sendPushover } from "@/lib/pushover-simple";
import { sendQuoteAcceptedEmail } from "@/lib/email-quote";
import { submitJotformAgreement } from "@/lib/jotform";
import { postWebhook } from "@/lib/webhook";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const sig = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const quoteId = session.metadata?.quote_id;
        const subSku = session.metadata?.subscription_sku;
        const hasCommitment = session.metadata?.has_commitment === "true";
        const commitmentMonths = parseInt(session.metadata?.commitment_months || "0", 10);

        if (!quoteId) break;

        // Retrieve payment_intent to get payment_method
        const pi = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );
        const paymentMethodId = pi.payment_method as string;
        const customerId = session.customer as string;

        // Attach payment method as default for future off-session charges
        if (customerId && paymentMethodId) {
          await stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
          });
        }

        // Create subscription with trial if we have a valid price
        let subscriptionId: string | null = null;
        const priceId = subSku ? STRIPE_PRICE_IDS[subSku] : null;
        if (customerId && priceId && paymentMethodId) {
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            trial_period_days: 180, // generous buffer; ended manually at install complete
            default_payment_method: paymentMethodId,
            metadata: {
              quote_id: quoteId,
              has_commitment: hasCommitment ? "true" : "false",
              commitment_months: commitmentMonths.toString(),
            },
          });
          subscriptionId = subscription.id;
        }

        // Fetch quote for notification context
        const { data: quote } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", quoteId)
          .single();

        // Update quote in database
        await supabase
          .from("quotes")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_payment_method_id: paymentMethodId,
            stripe_deposit_payment_intent_id: session.payment_intent as string,
            deposit_paid_at: new Date().toISOString(),
            status: "deposit_paid",
            has_commitment: hasCommitment,
            commitment_months: commitmentMonths,
          })
          .eq("id", quoteId);

        if (quote) {
          // Fire side effects in parallel
          await Promise.allSettled([
            sendPushover({
              title: "DEPOSIT PAID",
              message: `${quote.quote_number} — $${(quote.deposit_amount / 100).toFixed(2)} deposit received. ${quote.customer_first_name} ${quote.customer_last_name}. $19/mo Pro pending install.`,
            }),

            sendQuoteAcceptedEmail({
              customer_first_name: quote.customer_first_name,
              customer_email: quote.customer_email,
              quote_number: quote.quote_number,
            }).catch((err: unknown) => console.error("Accept email failed:", err)),

            submitJotformAgreement({
              quote_number: quote.quote_number,
              first_name: quote.customer_first_name,
              last_name: quote.customer_last_name,
              email: quote.customer_email,
              phone: quote.customer_phone || "",
              address: quote.property_address || "",
              city: quote.property_city || "",
              zip: quote.property_zip || "",
              carrier: quote.carrier || "",
              total: quote.total ?? 0,
              line_items: quote.line_items ?? [],
            }).catch((err: unknown) => console.error("Jotform failed:", err)),

            postWebhook({
              event: "deposit_paid",
              quote_id: quote.id,
              lead_id: quote.lead_id,
              customer: {
                first_name: quote.customer_first_name,
                last_name: quote.customer_last_name,
                email: quote.customer_email,
              },
              total: quote.total,
              deposit_amount: quote.deposit_amount,
              quote_number: quote.quote_number,
            }).catch((err: unknown) => console.error("Webhook failed:", err)),
          ]);
        }

        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
