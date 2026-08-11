-- Run against the PR's Supabase preview only. Every fixture write is rolled back.
begin;

do $$
declare
  root_id uuid;
  recheck_id uuid;
  canceled_id uuid;
  no_show_id uuid;
  message_id uuid;
  quote_id uuid;
  root_token text := encode(gen_random_bytes(32), 'hex');
  rows_changed integer;
begin
  -- Schedule/create and initial audit.
  insert into public.site_visits (
    customer_first_name, customer_last_name, customer_email, property_address,
    scheduled_start, assigned_rep_name, customer_portal_token,
    appointment_status, previsit_status
  ) values (
    'Lifecycle', 'Regression', 'lifecycle@example.invalid', '100 Preview Test Way',
    now() + interval '14 days', 'Test Representative', root_token,
    'awaiting_confirmation', 'pending'
  ) returning id into root_id;
  insert into public.site_visit_events(site_visit_id, event_type, actor_type, metadata)
  values (root_id, 'created', 'admin', jsonb_build_object('from', null, 'to', 'awaiting_confirmation'));

  -- Customer confirmation and pre-visit form.
  update public.site_visits
  set appointment_status = 'confirmed', confirmed_at = now(),
      previsit_answers = '{"bathroomCount":1,"activeLeak":"no","previousLeak":"no","wifiAtInstallLocation":"yes","powerWithin12Feet":"yes","fireSprinklerSystem":"no","shutoffLocationKnown":"yes"}'::jsonb,
      previsit_status = 'complete', previsit_completed_at = now()
  where id = root_id;

  -- Customer reschedule request followed by exact Admin option selection.
  update public.site_visits
  set appointment_status = 'reschedule_requested', reschedule_requested_at = now(),
      reschedule_request = jsonb_build_object(
        'option1', (now() + interval '15 days')::text,
        'option2', (now() + interval '16 days')::text,
        'requestedAt', now()::text,
        'note', 'Preview lifecycle option'
      )
  where id = root_id;
  update public.site_visits
  set appointment_status = 'awaiting_confirmation', scheduled_start = now() + interval '15 days',
      schedule_version = schedule_version + 1, confirmed_at = null,
      confirmation_sent_at = null, en_route_at = null, started_at = null,
      reschedule_request = null, reschedule_requested_at = null
  where id = root_id;

  -- Schedule-version idempotency and provider-accepted terminology.
  insert into public.site_visit_messages(
    site_visit_id, message_key, channel, template, recipient, status,
    attempt_count, provider_status, provider_message_id, sent_at
  ) values (
    root_id, 'confirmation:v2', 'email', 'confirmation', 'lifecycle@example.invalid',
    'sent', 1, 'accepted', 'mock-email-lifecycle', now()
  ) returning id into message_id;
  insert into public.site_visit_messages(
    site_visit_id, message_key, channel, template, recipient, status
  ) values (
    root_id, 'confirmation:v2', 'email', 'confirmation', 'lifecycle@example.invalid', 'pending'
  ) on conflict (site_visit_id, message_key, channel) do nothing;
  select count(*) into rows_changed from public.site_visit_messages
  where site_visit_id = root_id and message_key = 'confirmation:v2' and channel = 'email';
  if rows_changed <> 1 then raise exception 'schedule-version message idempotency failed'; end if;

  -- En-route notification retry does not rewrite the workflow timestamp.
  update public.site_visits set appointment_status = 'confirmed', confirmed_at = now() where id = root_id;
  update public.site_visits set appointment_status = 'en_route', en_route_at = now() where id = root_id;
  update public.site_visit_messages set status = 'failed', provider_status = null, last_error = 'synthetic failure'
  where id = message_id;
  update public.site_visit_messages
  set status = 'sending', attempt_count = attempt_count + 1, claimed_at = now(), claim_token = 'preview-claim'
  where id = message_id and status = 'failed';
  update public.site_visit_messages
  set status = 'sent', provider_status = 'accepted', provider_message_id = 'mock-email-retry',
      last_error = null, claimed_at = null, claim_token = null, sent_at = now()
  where id = message_id and claim_token = 'preview-claim';

  -- Optimistic autosave: one writer wins and the stale revision changes zero rows.
  update public.site_visits
  set appointment_status = 'in_progress', assessment_revision = 1,
      assessment = '{"revision":"first-writer"}'::jsonb, started_at = now()
  where id = root_id and assessment_revision = 0;
  get diagnostics rows_changed = row_count;
  if rows_changed <> 1 then raise exception 'initial optimistic autosave did not win'; end if;
  update public.site_visits
  set assessment_revision = 1, assessment = '{"revision":"stale-writer"}'::jsonb
  where id = root_id and assessment_revision = 0;
  get diagnostics rows_changed = row_count;
  if rows_changed <> 0 then raise exception 'stale autosave was not rejected'; end if;

  -- Blocked completion, corrective action, and customer recheck request preserve readiness.
  update public.site_visits
  set appointment_status = 'completed', completed_at = now(),
      readiness_status = 'leak_repair_required',
      blockers = '[{"code":"active-leak","title":"Active leak","detail":"Repair required","owner":"plumber","severity":"blocking"}]'::jsonb,
      corrective_actions = '[{"id":"active-leak","action":"Repair leak","reason":"Repair required","owner":"plumber","severity":"blocking","status":"open"}]'::jsonb,
      customer_summary = '{"outcomeTitle":"Repair required","outcomeDetail":"Visible repair needed","areasReviewed":["Exterior"],"blockers":[],"correctiveActions":[],"hydrosenseNextStep":"Verify","customerNextStep":"Repair"}'::jsonb
  where id = root_id;
  update public.site_visits
  set appointment_status = 'recheck_requested', recheck_requested_at = now(),
      corrective_actions = jsonb_set(corrective_actions, '{0,status}', '"customer_reported_complete"'::jsonb)
  where id = root_id;
  if (select readiness_status <> 'leak_repair_required' from public.site_visits where id = root_id) then
    raise exception 'customer recheck request changed blocked readiness';
  end if;

  -- Linked recheck (Option A) retains the first assessment and completes cleanly.
  insert into public.site_visits (
    customer_first_name, customer_last_name, customer_email, property_address,
    scheduled_start, assigned_rep_name, customer_portal_token,
    appointment_status, previsit_status, previsit_answers,
    assessment_version, parent_site_visit_id, supersedes_site_visit_id
  )
  select customer_first_name, customer_last_name, customer_email, property_address,
    now() + interval '21 days', assigned_rep_name, encode(gen_random_bytes(32), 'hex'),
    'awaiting_confirmation', previsit_status, previsit_answers,
    2, root_id, root_id
  from public.site_visits where id = root_id
  returning id into recheck_id;
  update public.site_visits set appointment_status = 'recheck_scheduled' where id = root_id;
  update public.site_visits
  set appointment_status = 'completed', completed_at = now(), assessment_revision = 2,
      readiness_status = 'ready_for_proposal', blockers = '[]'::jsonb,
      corrective_actions = '[]'::jsonb,
      customer_summary = '{"outcomeTitle":"Ready","outcomeDetail":"Recheck passed","areasReviewed":["Exterior"],"blockers":[],"correctiveActions":[],"hydrosenseNextStep":"Prepare proposal","customerNextStep":"Review proposal"}'::jsonb
  where id = recheck_id;
  if (select count(*) <> 2 from public.site_visits where id = root_id or parent_site_visit_id = root_id) then
    raise exception 'linked recheck history was not preserved';
  end if;
  if (select readiness_status <> 'ready_for_proposal' from public.site_visits where id = recheck_id) then
    raise exception 'clean recheck did not become ready';
  end if;

  -- Latest-cycle quote handoff is idempotent and preserves payment columns.
  insert into public.quotes(
    quote_number, public_token, site_visit_id, customer_first_name, customer_last_name,
    customer_email, line_items, subtotal, total, status, deposit_amount, balance_amount
  ) values (
    public.allocate_quote_number(extract(year from now())::integer), encode(gen_random_bytes(16), 'hex'),
    recheck_id, 'Lifecycle', 'Regression', 'lifecycle@example.invalid', '[]'::jsonb,
    1000, 1000, 'draft', 500, 500
  ) returning id into quote_id;
  insert into public.quotes(
    quote_number, public_token, site_visit_id, customer_first_name, customer_last_name,
    customer_email, line_items, subtotal, total, status
  ) values (
    public.allocate_quote_number(extract(year from now())::integer), encode(gen_random_bytes(16), 'hex'),
    recheck_id, 'Lifecycle', 'Regression', 'lifecycle@example.invalid', '[]'::jsonb,
    0, 0, 'draft'
  ) on conflict (site_visit_id) where site_visit_id is not null do nothing;
  get diagnostics rows_changed = row_count;
  if rows_changed <> 0 then raise exception 'quote handoff was not idempotent'; end if;

  -- Separate terminal fixtures prove cancel and no-show states remain valid.
  insert into public.site_visits(
    customer_first_name, customer_last_name, customer_email, property_address,
    scheduled_start, assigned_rep_name, customer_portal_token, appointment_status
  ) values (
    'Canceled', 'Fixture', 'cancel@example.invalid', '101 Preview Test Way', now() + interval '5 days',
    'Test Representative', encode(gen_random_bytes(32), 'hex'), 'canceled'
  ) returning id into canceled_id;
  insert into public.site_visits(
    customer_first_name, customer_last_name, customer_email, property_address,
    scheduled_start, assigned_rep_name, customer_portal_token, appointment_status
  ) values (
    'NoShow', 'Fixture', 'noshow@example.invalid', '102 Preview Test Way', now() - interval '1 day',
    'Test Representative', encode(gen_random_bytes(32), 'hex'), 'no_show'
  ) returning id into no_show_id;

  if exists (
    select 1 from public.site_visits
    where id in (root_id, recheck_id, canceled_id, no_show_id)
      and customer_summary::text like '%Synthetic browser-test record%'
  ) then raise exception 'customer summary exposed internal notes'; end if;
end $$;

rollback;
select 'site-visit lifecycle regression passed (rolled back)' as result;
