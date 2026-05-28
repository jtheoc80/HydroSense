-- Run this if you already ran 0001 and need to add the new columns.
-- Skip if you are starting fresh with 0001 (which already includes these).

alter table public.leads add column if not exists lead_score integer default 0;
alter table public.leads add column if not exists lead_tier text default 'cold';
alter table public.leads add column if not exists booked_at timestamptz;
alter table public.leads add column if not exists meeting_url text;

create index if not exists leads_lead_tier_idx on public.leads (lead_tier);
