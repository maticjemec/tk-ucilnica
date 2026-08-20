-- TASK 013A — validation queries + manual DB test plan
-- Run after 003_program_content.sql and program_content.sql.
-- These queries do not mutate data.
--
-- MANUAL TEST PLAN
-- A) Run supabase/migrations/003_program_content.sql
--    → tables public.programs, public.program_sections, public.lessons exist
-- B) Run supabase/seed/program_content.sql
--    → 8 program rows
-- C) Query programs
--    → slugs / prices / categories match catalog
-- D) Query confidence curriculum
--    → current owned lesson slugs and orders preserved
-- E) Rerun program_content.sql
--    → no duplicate rows
-- F) Anonymous / authenticated SELECT
--    → only published content (set is_published=false on a test row to confirm)
-- G) Existing app
--    → Vsi programi, public detail, Moji programi, lesson player still use
--      local TypeScript; no behavior change from this task
--
-- Known diagnostic (query E):
-- Catalog-only programs have programs.lesson_count from catalog.ts but 0
-- lesson rows until a later task authors curriculum. Owned programs should
-- match published lesson counts.

-- ---------------------------------------------------------------------------
-- A) Published programs ordered by sort_order
-- ---------------------------------------------------------------------------
select
  p.slug,
  p.title,
  p.category,
  p.category_label,
  p.price_cents,
  p.currency,
  p.duration_label,
  p.lesson_count,
  p.is_published,
  p.is_featured,
  p.sort_order
from public.programs p
where p.is_published = true
order by p.sort_order, p.title;

-- ---------------------------------------------------------------------------
-- B) Count lessons per program
-- ---------------------------------------------------------------------------
select
  p.slug,
  p.title,
  p.lesson_count as declared_lesson_count,
  (
    select count(*)
    from public.lessons l
    where l.program_id = p.id
  ) as actual_lesson_count,
  (
    select count(*)
    from public.lessons l
    where l.program_id = p.id
      and l.is_published
  ) as published_lesson_count,
  (
    select count(*)
    from public.program_sections ps
    where ps.program_id = p.id
  ) as section_count
from public.programs p
order by p.sort_order;

-- ---------------------------------------------------------------------------
-- C) Sections + lessons for a given program slug
--    Change the slug to inspect another owned program.
-- ---------------------------------------------------------------------------
select
  p.slug as program_slug,
  ps.section_order,
  ps.title as section_title,
  l.lesson_order,
  l.slug as lesson_slug,
  l.title as lesson_title,
  l.duration_minutes,
  l.content_type,
  l.is_preview,
  l.is_published,
  l.unlock_mode
from public.programs p
join public.program_sections ps on ps.program_id = p.id
join public.lessons l
  on l.program_id = p.id
 and l.section_id = ps.id
where p.slug = '21-dni-do-boljse-samozavesti'
order by ps.section_order, l.lesson_order;

-- ---------------------------------------------------------------------------
-- D) Duplicate lesson slug / order issues (must return 0 rows)
-- ---------------------------------------------------------------------------
select
  p.slug as program_slug,
  l.slug as lesson_slug,
  count(*) as row_count
from public.lessons l
join public.programs p on p.id = l.program_id
group by p.slug, l.slug
having count(*) > 1;

select
  p.slug as program_slug,
  l.lesson_order,
  count(*) as row_count
from public.lessons l
join public.programs p on p.id = l.program_id
group by p.slug, l.lesson_order
having count(*) > 1;

select
  p.slug as program_slug,
  ps.section_order,
  count(*) as row_count
from public.program_sections ps
join public.programs p on p.id = ps.program_id
group by p.slug, ps.section_order
having count(*) > 1;

-- ---------------------------------------------------------------------------
-- E) Declared lesson_count vs actual lesson rows
--    Empty for owned programs after seed.
--    Catalog-only programs currently mismatch (declared count, 0 rows).
-- ---------------------------------------------------------------------------
select
  p.slug,
  p.lesson_count as declared_lesson_count,
  count(l.id) as actual_lesson_count,
  (p.lesson_count - count(l.id)) as delta
from public.programs p
left join public.lessons l on l.program_id = p.id
group by p.id
having p.lesson_count is distinct from count(l.id)
order by p.sort_order;

-- Owned programs only: this should be empty after seed
select
  p.slug,
  p.lesson_count as declared_lesson_count,
  count(l.id) as actual_lesson_count
from public.programs p
left join public.lessons l on l.program_id = p.id
where p.slug in (
  '21-dni-do-manj-anksioznosti',
  '21-dni-do-boljse-samozavesti',
  'najdi-sebe',
  'samohipnoza-v-praksi'
)
group by p.id
having p.lesson_count is distinct from count(l.id);

-- ---------------------------------------------------------------------------
-- Extra: entitlement / progress identity checks
-- ---------------------------------------------------------------------------
-- Program slugs that would not match a user_programs.program_slug identity
select p.slug as program_slug
from public.programs p
where p.slug not in (
  '21-dni-do-manj-anksioznosti',
  '21-dni-do-boljse-samozavesti',
  'najdi-sebe',
  'samohipnoza-v-praksi',
  'boljsi-spanec-boljse-jutri',
  'umiri-telo-umiri-um',
  'zasij-v-21-dneh',
  '21-dni-hvaleznosti'
);

-- Confidence visible lesson slugs (must match owned-program.ts)
select
  l.lesson_order,
  l.slug,
  l.title
from public.lessons l
join public.programs p on p.id = l.program_id
where p.slug = '21-dni-do-boljse-samozavesti'
order by l.lesson_order;

-- ---------------------------------------------------------------------------
-- Extra: RLS smoke (run as a role without service_role if possible)
-- Unpublished program / lesson rows must not appear for anon/authenticated.
-- ---------------------------------------------------------------------------
-- Optional: temporarily unpublish one program, then rerun query A,
-- then set it back. Do this only on a non-production branch.
--
-- update public.programs
-- set is_published = false
-- where slug = '21-dni-hvaleznosti';
--
-- select p.slug from public.programs p order by p.sort_order;
--
-- update public.programs
-- set is_published = true
-- where slug = '21-dni-hvaleznosti';
