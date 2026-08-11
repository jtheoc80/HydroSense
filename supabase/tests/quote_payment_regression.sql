-- Run against the PR's Supabase preview only. All fixture writes are rolled back.
begin;

do $$
declare
  visit_id uuid;
  quote_id uuid;
  quote_number_one text;
  quote_number_two text;
  next_status text;
begin
  insert into public.site_visits (
    customer_first_name, customer_last_name, customer_email, property_address,
    scheduled_start, assigned_rep_name, customer_portal_token
  ) values (
    'Preview', 'Regression', 'preview-regression@example.invalid', '123 Test St',
    now() + interval '7 days', 'Test Representative', encode(gen_random_bytes(32), 'hex')
  ) returning id into visit_id;

  quote_number_one := public.allocate_quote_number(extract(year from now())::integer);
  quote_number_two := public.allocate_quote_number(extract(year from now())::integer);
  if quote_number_one = quote_number_two then raise exception 'quote numbers collided'; end if;

  insert into public.quotes (
    quote_number, public_token, site_visit_id, customer_first_name, customer_last_name,
    customer_email, line_items, subtotal, total, status, deposit_amount, balance_amount,
    has_commitment, commitment_months
  ) values (
    quote_number_one, encode(gen_random_bytes(16), 'hex'), visit_id, 'Preview', 'Regression',
    'preview-regression@example.invalid', '[]'::jsonb, 1000, 1000, 'draft', 500, 500, true, 12
  ) returning id into quote_id;

  foreach next_status in array array[
    'sent', 'viewed', 'accepted', 'deposit_paid', 'install_scheduled',
    'install_complete', 'deposit_refunded', 'canceled'
  ] loop
    update public.quotes set status = next_status where id = quote_id;
  end loop;

  if not exists (select 1 from public.quotes where id = quote_id and site_visit_id = visit_id and has_commitment) then
    raise exception 'quote/site-visit backlink or payment fields regressed';
  end if;
end $$;

rollback;
select 'quote/payment regression passed (rolled back)' as result;
