-- Run against the PR's Supabase preview only. This script is read-only.
do $$
declare
  required_columns text[] := array[
    'deposit_amount', 'balance_amount', 'deposit_paid_at', 'balance_charged_at',
    'stripe_checkout_session_id', 'stripe_deposit_payment_intent_id',
    'stripe_balance_payment_intent_id', 'stripe_payment_method_id',
    'stripe_customer_id', 'stripe_subscription_id', 'has_commitment',
    'commitment_months', 'commitment_end_date', 'install_scheduled_date',
    'install_completed_at', 'site_visit_id'
  ];
  missing_columns text[];
  status_definition text;
  expected_status text;
begin
  select array_agg(required.required_column order by required.required_column) into missing_columns
  from unnest(required_columns) as required(required_column)
  where not exists (
    select 1 from information_schema.columns c
    where c.table_schema = 'public' and c.table_name = 'quotes' and c.column_name = required.required_column
  );
  if missing_columns is not null then
    raise exception 'quotes schema is missing columns: %', missing_columns;
  end if;

  select pg_get_constraintdef(oid) into status_definition
  from pg_constraint
  where conrelid = 'public.quotes'::regclass and conname = 'quotes_status_check';
  foreach expected_status in array array[
    'draft', 'sent', 'viewed', 'accepted', 'declined', 'expired',
    'deposit_paid', 'install_scheduled', 'install_complete', 'deposit_refunded', 'canceled'
  ] loop
    if status_definition is null or position(expected_status in status_definition) = 0 then
      raise exception 'quotes_status_check does not allow %: %', expected_status, status_definition;
    end if;
  end loop;

  if not exists (select 1 from pg_proc where proname = 'allocate_quote_number' and pronamespace = 'public'::regnamespace) then
    raise exception 'atomic quote allocator is missing';
  end if;
end $$;

select 'preview schema parity passed' as result;
