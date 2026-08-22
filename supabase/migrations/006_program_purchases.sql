-- TASK 018A — Stripe payment ledger
-- program_purchases is the Checkout attempt / payment record.
-- stripe_webhook_events is event-level idempotency.
-- user_programs remains access control only. Authenticated users
-- cannot read or write payment rows.

-- ---------------------------------------------------------------------------
-- program_purchases
-- ---------------------------------------------------------------------------
create table public.program_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  program_id uuid not null references public.programs (id),
  program_slug text not null,
  stripe_checkout_session_id text null,
  stripe_payment_intent_id text null,
  amount_cents integer not null,
  currency text not null,
  status text not null,
  source text not null default 'stripe',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz null,
  constraint program_purchases_amount_cents_check check (amount_cents >= 1),
  constraint program_purchases_status_check
    check (status in ('pending', 'paid', 'canceled', 'expired', 'failed')),
  constraint program_purchases_stripe_checkout_session_id_key
    unique (stripe_checkout_session_id)
);

create index program_purchases_user_id_idx
  on public.program_purchases (user_id);
create index program_purchases_program_slug_idx
  on public.program_purchases (program_slug);
create index program_purchases_status_idx
  on public.program_purchases (status);

comment on table public.program_purchases is
  'Stripe Checkout ledger. One row per checkout attempt. Not an access-control table.';

comment on column public.program_purchases.amount_cents is
  'Price snapshot at Checkout creation. Webhook must match this, not live catalog price.';

comment on column public.program_purchases.status is
  'pending | paid | canceled | expired | failed. Entitlement is granted only when paid.';

create trigger program_purchases_set_updated_at
  before update on public.program_purchases
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- stripe_webhook_events
-- ---------------------------------------------------------------------------
create table public.stripe_webhook_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

comment on table public.stripe_webhook_events is
  'Processed Stripe event IDs. Insert-first idempotency for webhook deliveries.';

-- ---------------------------------------------------------------------------
-- RLS / grants — no client access in V1
-- ---------------------------------------------------------------------------
alter table public.program_purchases enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on table public.program_purchases from public;
revoke all on table public.program_purchases from anon;
revoke all on table public.program_purchases from authenticated;

revoke all on table public.stripe_webhook_events from public;
revoke all on table public.stripe_webhook_events from anon;
revoke all on table public.stripe_webhook_events from authenticated;

grant all on table public.program_purchases to service_role;
grant all on table public.stripe_webhook_events to service_role;
