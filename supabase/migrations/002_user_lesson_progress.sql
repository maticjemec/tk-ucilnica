-- TASK 012 — per-user lesson progress
-- Program catalog, lesson content, materials, and videos stay in local TypeScript.
-- This table stores authenticated user progress only.

create table public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  program_slug text not null,
  lesson_slug text not null,
  completed boolean not null default false,
  completed_at timestamptz null,
  last_opened_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_lesson_progress_user_id_program_slug_lesson_slug_key
    unique (user_id, program_slug, lesson_slug)
);

create index user_lesson_progress_user_id_idx
  on public.user_lesson_progress (user_id);

create index user_lesson_progress_program_slug_idx
  on public.user_lesson_progress (program_slug);

create index user_lesson_progress_user_id_program_slug_idx
  on public.user_lesson_progress (user_id, program_slug);

comment on table public.user_lesson_progress is
  'Per-user lesson progress. program_slug and lesson_slug match local TypeScript content identity.';

comment on column public.user_lesson_progress.program_slug is
  'Local program identity (not a database foreign key).';

comment on column public.user_lesson_progress.lesson_slug is
  'Local lesson identity within a program (not a database foreign key).';

comment on column public.user_lesson_progress.completed is
  'True after the learner marks the lesson as done. Opening a lesson must not clear this.';

comment on column public.user_lesson_progress.completed_at is
  'Set when completed becomes true. Null while the lesson is incomplete.';

create or replace function public.set_user_lesson_progress_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_lesson_progress_set_updated_at
  before update on public.user_lesson_progress
  for each row
  execute procedure public.set_user_lesson_progress_updated_at();

alter table public.user_lesson_progress enable row level security;

-- Authenticated users may SELECT / INSERT / UPDATE only their own rows.
-- No DELETE policy for anon or authenticated.
-- Anon has no access.
create policy "user_lesson_progress_select_own"
  on public.user_lesson_progress
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_lesson_progress_insert_own"
  on public.user_lesson_progress
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_lesson_progress_update_own"
  on public.user_lesson_progress
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.user_lesson_progress from public;
revoke all on table public.user_lesson_progress from anon;
revoke all on table public.user_lesson_progress from authenticated;

grant select, insert, update on table public.user_lesson_progress to authenticated;
grant all on table public.user_lesson_progress to service_role;
