-- Closed-loop site visit workflow
-- Public access is intentionally denied. Application access uses the server-side service role.

create extension if not exists "pgcrypto";

create table public.site_visits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid null references public.leads(id) on delete set null,
  customer_first_name text not null,
  customer_last_name text not null,
  customer_phone text null,
  customer_email text null,
  property_address text not null,
  property_city text null,
  property_zip text null,
  scheduled_start timestamptz not null,
  arrival_window_minutes integer not null default 30,
  estimated_duration_minutes integer not null default 60,
  timezone text not null default 'America/Chicago',
  schedule_version integer not null default 1,
  assigned_rep_name text not null,
  assigned_rep_phone text null,
  source text null,
  internal_notes text null,
  customer_portal_token text not null unique,
  appointment_status text not null default 'draft',
  previsit_status text not null default 'not_sent',
  readiness_status text not null default 'unassessed',
  previsit_answers jsonb not null default '{}'::jsonb,
  assessment jsonb not null default '{}'::jsonb,
  blockers jsonb not null default '[]'::jsonb,
  corrective_actions jsonb not null default '[]'::jsonb,
  reschedule_request jsonb null,
  customer_summary jsonb null,
  confirmed_at timestamptz null,
  confirmation_sent_at timestamptz null,
  previsit_completed_at timestamptz null,
  reschedule_requested_at timestamptz null,
  canceled_at timestamptz null,
  en_route_at timestamptz null,
  started_at timestamptz null,
  completed_at timestamptz null,
  summary_sent_at timestamptz null,
  customer_acknowledged_at timestamptz null,
  recheck_requested_at timestamptz null,
  follow_up_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_visits_contact_required check (
    nullif(btrim(customer_phone), '') is not null
    or nullif(btrim(customer_email), '') is not null
  ),
  constraint site_visits_arrival_window_check check (arrival_window_minutes between 0 and 240),
  constraint site_visits_duration_check check (estimated_duration_minutes between 15 and 480),
  constraint site_visits_schedule_version_check check (schedule_version > 0),
  constraint site_visits_appointment_status_check check (appointment_status in (
    'draft', 'awaiting_confirmation', 'confirmed', 'reschedule_requested', 'canceled',
    'en_route', 'in_progress', 'completed', 'no_show', 'recheck_requested'
  )),
  constraint site_visits_previsit_status_check check (previsit_status in ('not_sent', 'pending', 'complete')),
  constraint site_visits_readiness_status_check check (readiness_status in (
    'unassessed', 'ready_for_proposal', 'site_prep_required',
    'leak_repair_required', 'plumber_review_required'
  ))
);

create table public.site_visit_events (
  id uuid primary key default gen_random_uuid(),
  site_visit_id uuid not null references public.site_visits(id) on delete cascade,
  event_type text not null,
  actor_type text not null,
  actor_label text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint site_visit_events_actor_type_check check (actor_type in ('system', 'admin', 'representative', 'customer'))
);

create table public.site_visit_messages (
  id uuid primary key default gen_random_uuid(),
  site_visit_id uuid not null references public.site_visits(id) on delete cascade,
  message_key text not null,
  channel text not null,
  template text not null,
  recipient text not null,
  status text not null default 'pending',
  attempt_count integer not null default 0,
  provider_message_id text null,
  last_error text null,
  sent_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_visit_messages_channel_check check (channel in ('sms', 'email')),
  constraint site_visit_messages_status_check check (status in ('pending', 'sending', 'sent', 'failed', 'skipped')),
  constraint site_visit_messages_attempt_count_check check (attempt_count >= 0),
  unique (site_visit_id, message_key, channel)
);

create index site_visits_scheduled_start_idx on public.site_visits (scheduled_start);
create index site_visits_upcoming_active_idx on public.site_visits (scheduled_start, appointment_status)
  where appointment_status not in ('canceled', 'completed', 'no_show');
create index site_visits_appointment_status_idx on public.site_visits (appointment_status);
create index site_visits_readiness_status_idx on public.site_visits (readiness_status);
create index site_visits_lead_id_idx on public.site_visits (lead_id);
create index site_visits_assigned_rep_idx on public.site_visits (assigned_rep_name);
create index site_visits_customer_token_idx on public.site_visits (customer_portal_token);
create index site_visit_events_visit_created_idx on public.site_visit_events (site_visit_id, created_at desc);
create index site_visit_messages_visit_status_idx on public.site_visit_messages (site_visit_id, status);

alter table public.quotes add column if not exists site_visit_id uuid null
  references public.site_visits(id) on delete set null;
create unique index if not exists quotes_site_visit_id_unique_idx
  on public.quotes(site_visit_id) where site_visit_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_visits_set_updated_at
before update on public.site_visits
for each row execute function public.set_updated_at();

create trigger site_visit_messages_set_updated_at
before update on public.site_visit_messages
for each row execute function public.set_updated_at();

create or replace function public.prevent_site_visit_event_mutation()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  raise exception 'site_visit_events is append-only';
end;
$$;

create trigger site_visit_events_append_only
before update or delete on public.site_visit_events
for each row execute function public.prevent_site_visit_event_mutation();

alter table public.site_visits enable row level security;
alter table public.site_visit_events enable row level security;
alter table public.site_visit_messages enable row level security;

revoke all on table public.site_visits from anon, authenticated;
revoke all on table public.site_visit_events from anon, authenticated;
revoke all on table public.site_visit_messages from anon, authenticated;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.prevent_site_visit_event_mutation() from public, anon, authenticated;
