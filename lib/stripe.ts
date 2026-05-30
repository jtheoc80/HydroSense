import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  _stripe = new Stripe(key);
  return _stripe;
}

// Map subscription SKUs to Stripe Price IDs
// Set these in your Stripe dashboard and update here
export const STRIPE_PRICE_IDS: Record<string, string> = {
  "MON-PRO-MO": process.env.STRIPE_PRICE_MON_PRO_MONTHLY || "",
  "MON-PRO-YR": process.env.STRIPE_PRICE_MON_PRO_ANNUAL || "",
};

/** Identify subscription SKU from line items */
export function getSubscriptionSku(
  lineItems: { sku: string }[]
): string | null {
  for (const li of lineItems) {
    if (li.sku in STRIPE_PRICE_IDS) return li.sku;
  }
  return null;
}
