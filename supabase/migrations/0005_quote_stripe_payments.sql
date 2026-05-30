-- Add Stripe payment columns and new statuses to quotes table

-- New columns for 50/50 payment split
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS deposit_amount integer;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS balance_amount integer;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS deposit_paid_at timestamptz;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS balance_charged_at timestamptz;

-- Stripe IDs
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_deposit_payment_intent_id text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_balance_payment_intent_id text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_payment_method_id text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- Commitment / install tracking
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS has_commitment boolean DEFAULT false;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS commitment_months integer DEFAULT 0;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS commitment_end_date timestamptz;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS install_scheduled_date timestamptz;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS install_completed_at timestamptz;

-- Expand status CHECK constraint to include new payment states
ALTER TABLE public.quotes DROP CONSTRAINT IF EXISTS quotes_status_check;
ALTER TABLE public.quotes ADD CONSTRAINT quotes_status_check
  CHECK (status IN (
    'draft', 'sent', 'viewed', 'accepted', 'declined', 'expired',
    'deposit_paid', 'install_scheduled', 'install_complete',
    'deposit_refunded', 'canceled'
  ));
