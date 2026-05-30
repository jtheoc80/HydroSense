export interface LineItem {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Quote {
  id: string;
  quote_number: string;
  public_token: string;
  lead_id: string | null;
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
  notes_internal: string | null;
  notes_customer: string | null;
  deposit_amount: number | null;
  balance_amount: number | null;
  deposit_paid_at: string | null;
  balance_charged_at: string | null;
  stripe_checkout_session_id: string | null;
  stripe_deposit_payment_intent_id: string | null;
  stripe_balance_payment_intent_id: string | null;
  stripe_payment_method_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  has_commitment: boolean;
  commitment_months: number;
  commitment_end_date: string | null;
  install_scheduled_date: string | null;
  install_completed_at: string | null;
  status:
    | "draft"
    | "sent"
    | "viewed"
    | "accepted"
    | "declined"
    | "expired"
    | "deposit_paid"
    | "install_scheduled"
    | "install_complete"
    | "deposit_refunded"
    | "canceled";
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  expires_at: string | null;
}
