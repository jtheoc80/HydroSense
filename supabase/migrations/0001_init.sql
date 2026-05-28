create extension if not exists "pgcrypto";

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  zip text not null,
  address text,
  carrier text,
  message text,
  city text,
  campaign text,
  source text not null default 'hydrosensetx.com',
  page_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  user_agent text,
  ip_address text,
  status text not null default 'new',
  notes text
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_email_idx on public.leads (email);
create index leads_status_idx on public.leads (status);

alter table public.leads enable row level security;
-- No public policies. Server uses service role key to bypass RLS.
