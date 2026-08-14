create table public.quote_delivery_events (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  attempt_id uuid not null,
  channel text not null check (channel in ('email', 'sms')),
  provider text not null check (provider in ('resend', 'twilio')),
  recipient text not null,
  copy_recipient text,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  provider_message_id text,
  provider_status text,
  error text,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (attempt_id, channel)
);

create index quote_delivery_events_quote_created_idx
  on public.quote_delivery_events (quote_id, created_at desc);

alter table public.quote_delivery_events enable row level security;

revoke all on public.quote_delivery_events from public, anon, authenticated;
grant select, insert, update on public.quote_delivery_events to service_role;

comment on table public.quote_delivery_events is
  'Append-only audit history for every customer quote email and SMS send attempt.';

comment on column public.quote_delivery_events.copy_recipient is
  'Internal BCC recipient for the emailed quote; never exposed to the customer.';
