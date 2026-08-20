-- TASK 013A — program catalog / curriculum tables
-- Local TypeScript remains the runtime source of truth for pages.
-- These tables store program, section, and lesson content for a later switch.
-- program slug identity must stay aligned with public.user_programs.program_slug
-- and public.user_lesson_progress.program_slug / lesson_slug.

-- ---------------------------------------------------------------------------
-- Reusable updated_at trigger
-- TASK 012 already has public.set_user_lesson_progress_updated_at() for
-- user_lesson_progress. That function is table-specific by name, so this
-- migration adds one generic function and reuses it for the three new tables.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
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

-- ---------------------------------------------------------------------------
-- programs
-- ---------------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text null,
  short_description text null,
  long_description text null,
  category text not null,
  category_label text not null,
  price_cents integer not null default 0,
  currency text not null default 'EUR',
  duration_label text null,
  difficulty text null,
  lesson_count integer not null default 0,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  cover_image_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint programs_price_cents_check check (price_cents >= 0),
  constraint programs_lesson_count_check check (lesson_count >= 0)
);

create index programs_category_idx on public.programs (category);
create index programs_is_published_idx on public.programs (is_published);
create index programs_sort_order_idx on public.programs (sort_order);

comment on table public.programs is
  'Program catalog rows. slug is the canonical identity shared with user_programs and user_lesson_progress.';

comment on column public.programs.slug is
  'Canonical program identity. Must match user_programs.program_slug and local TypeScript slugs.';

comment on column public.programs.lesson_count is
  'Declared lesson count. Seed keeps this aligned with published lesson rows where curriculum exists.';

comment on column public.programs.is_published is
  'Unpublished programs are hidden from anon and authenticated SELECT policies.';

create trigger programs_set_updated_at
  before update on public.programs
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- program_sections
-- ---------------------------------------------------------------------------
create table public.program_sections (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  title text not null,
  description text null,
  section_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint program_sections_program_id_section_order_key
    unique (program_id, section_order),
  constraint program_sections_section_order_check check (section_order > 0)
);

create index program_sections_program_id_idx
  on public.program_sections (program_id);

comment on table public.program_sections is
  'Weeks or parts within a program. section_order is 1-based and unique per program.';

create trigger program_sections_set_updated_at
  before update on public.program_sections
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs (id) on delete cascade,
  section_id uuid null references public.program_sections (id) on delete set null,
  slug text not null,
  title text not null,
  description text null,
  lesson_order integer not null,
  duration_minutes integer null,
  content_type text not null default 'video',
  video_url text null,
  audio_url text null,
  worksheet_url text null,
  is_preview boolean not null default false,
  is_published boolean not null default true,
  unlock_mode text null,
  unlock_at timestamptz null,
  day_offset integer null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lessons_program_id_slug_key unique (program_id, slug),
  constraint lessons_program_id_lesson_order_key unique (program_id, lesson_order),
  constraint lessons_lesson_order_check check (lesson_order > 0),
  constraint lessons_duration_minutes_check
    check (duration_minutes is null or duration_minutes > 0),
  constraint lessons_content_type_check
    check (content_type in ('video', 'audio', 'text', 'worksheet', 'mixed')),
  constraint lessons_unlock_mode_check
    check (unlock_mode is null or unlock_mode in ('all', 'sequential', 'drip'))
);

create index lessons_program_id_idx on public.lessons (program_id);
create index lessons_section_id_idx on public.lessons (section_id);
create index lessons_is_published_idx on public.lessons (is_published);
create index lessons_lesson_order_idx on public.lessons (lesson_order);

comment on table public.lessons is
  'Lesson content rows. slug is unique per program and must match user_lesson_progress.lesson_slug.';

comment on column public.lessons.slug is
  'Canonical lesson identity within a program. Must match local TypeScript lesson slugs.';

comment on column public.lessons.unlock_mode is
  'Optional per-lesson unlock hint (all, sequential, drip). Prepared for later drip logic.';

comment on column public.lessons.video_url is
  'Future hosted video URL. Seed leaves this null; no media upload in TASK 013A.';

comment on column public.lessons.worksheet_url is
  'Future worksheet URL. Seed leaves this null; no file upload in TASK 013A.';

create trigger lessons_set_updated_at
  before update on public.lessons
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS — published catalog content is readable; nobody writes from the client
-- ---------------------------------------------------------------------------
alter table public.programs enable row level security;
alter table public.program_sections enable row level security;
alter table public.lessons enable row level security;

create policy "programs_select_published"
  on public.programs
  for select
  to anon, authenticated
  using (is_published = true);

create policy "program_sections_select_published_program"
  on public.program_sections
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.programs p
      where p.id = program_sections.program_id
        and p.is_published = true
    )
  );

create policy "lessons_select_published"
  on public.lessons
  for select
  to anon, authenticated
  using (
    is_published = true
    and exists (
      select 1
      from public.programs p
      where p.id = lessons.program_id
        and p.is_published = true
    )
  );

-- No INSERT / UPDATE / DELETE policies for anon or authenticated.
-- Future admin/CMS writes use service_role or trusted backend flows.

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
revoke all on table public.programs from public;
revoke all on table public.programs from anon;
revoke all on table public.programs from authenticated;

revoke all on table public.program_sections from public;
revoke all on table public.program_sections from anon;
revoke all on table public.program_sections from authenticated;

revoke all on table public.lessons from public;
revoke all on table public.lessons from anon;
revoke all on table public.lessons from authenticated;

grant select on table public.programs to anon, authenticated;
grant select on table public.program_sections to anon, authenticated;
grant select on table public.lessons to anon, authenticated;

grant all on table public.programs to service_role;
grant all on table public.program_sections to service_role;
grant all on table public.lessons to service_role;
