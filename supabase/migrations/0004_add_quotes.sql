-- Quote system table
-- Idempotent: safe to run multiple times

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quotes') THEN
    CREATE TABLE public.quotes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      quote_number text UNIQUE NOT NULL,
      public_token text UNIQUE NOT NULL,
      lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
      customer_first_name text NOT NULL,
      customer_last_name text NOT NULL,
      customer_email text NOT NULL,
      customer_phone text,
      property_address text,
      property_city text,
      property_zip text,
      carrier text,
      carrier_premium_estimate numeric,
      carrier_discount_pct numeric,
      carrier_water_portion_pct numeric DEFAULT 0.10,
      carrier_annual_estimate numeric,
      line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
      subtotal numeric NOT NULL DEFAULT 0,
      total numeric NOT NULL DEFAULT 0,
      notes_internal text,
      notes_customer text,
      status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
      created_at timestamptz NOT NULL DEFAULT now(),
      sent_at timestamptz,
      viewed_at timestamptz,
      accepted_at timestamptz,
      declined_at timestamptz,
      expires_at timestamptz DEFAULT (now() + interval '7 days')
    );

    CREATE INDEX quotes_lead_id_idx ON public.quotes(lead_id);
    CREATE INDEX quotes_status_idx ON public.quotes(status);
    CREATE INDEX quotes_public_token_idx ON public.quotes(public_token);

    ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
