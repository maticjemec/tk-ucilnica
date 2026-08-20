-- TASK 011 — per-user program entitlements
-- Program catalog/content stays in local TypeScript.
-- This table stores ownership only. Do not grant write access to authenticated users.

create table public.user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  program_slug text not null,
  granted_at timestamptz not null default now(),
  access_expires_at timestamptz null,
  source text not null default 'manual',
  created_at timestamptz not null default now(),
  constraint user_programs_user_id_program_slug_key unique (user_id, program_slug)
);

create index user_programs_user_id_idx on public.user_programs (user_id);
create index user_programs_program_slug_idx on public.user_programs (program_slug);

comment on table public.user_programs is
  'Per-user program ownership. program_slug matches local TypeScript program identity.';

comment on column public.user_programs.program_slug is
  'Local program identity (not a database foreign key).';

comment on column public.user_programs.access_expires_at is
  'Null means lifetime access. Expired rows must be treated as not owned.';

comment on column public.user_programs.source is
  'How access was granted (manual, payment, admin). Authenticated users cannot set this.';

alter table public.user_programs enable row level security;

-- Authenticated users may SELECT only their own rows.
-- No INSERT / UPDATE / DELETE policies for anon or authenticated.
create policy "user_programs_select_own"
  on public.user_programs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.user_programs from public;
revoke all on table public.user_programs from anon;
revoke all on table public.user_programs from authenticated;

grant select on table public.user_programs to authenticated;
grant all on table public.user_programs to service_role;
