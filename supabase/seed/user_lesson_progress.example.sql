-- Optional SQL test snippets for public.user_lesson_progress
-- Replace USER_UUID_HERE with an auth.users id from Authentication > Users.
-- Do not commit real user UUIDs into migrations.
-- Do NOT copy mock/demo completion into the database for every user.
-- A real new user starts at 0% until rows exist.
--
-- Currently supported program_slug values:
--   21-dni-do-manj-anksioznosti
--   21-dni-do-boljse-samozavesti
--   najdi-sebe
--   samohipnoza-v-praksi
--
-- Run query / insert / reset blocks separately.

-- ---------------------------------------------------------------------------
-- Query progress for one test user
-- ---------------------------------------------------------------------------
select
  id,
  user_id,
  program_slug,
  lesson_slug,
  completed,
  completed_at,
  last_opened_at,
  created_at,
  updated_at
from public.user_lesson_progress
where user_id = 'USER_UUID_HERE'
order by program_slug, lesson_slug;

-- Progress for one owned program
select *
from public.user_lesson_progress
where user_id = 'USER_UUID_HERE'
  and program_slug = '21-dni-do-boljse-samozavesti'
order by last_opened_at desc;

-- Completed lesson slugs for percentage checks
select lesson_slug
from public.user_lesson_progress
where user_id = 'USER_UUID_HERE'
  and program_slug = '21-dni-do-boljse-samozavesti'
  and completed = true
order by lesson_slug;

-- ---------------------------------------------------------------------------
-- Optional: insert a completed first lesson (manual test only)
-- ---------------------------------------------------------------------------
-- insert into public.user_lesson_progress (
--   user_id,
--   program_slug,
--   lesson_slug,
--   completed,
--   completed_at,
--   last_opened_at
-- )
-- values (
--   'USER_UUID_HERE',
--   '21-dni-do-boljse-samozavesti',
--   'spoznaj-svojo-vrednost',
--   true,
--   now(),
--   now()
-- )
-- on conflict (user_id, program_slug, lesson_slug) do update
-- set
--   completed = excluded.completed,
--   completed_at = excluded.completed_at,
--   last_opened_at = excluded.last_opened_at;

-- ---------------------------------------------------------------------------
-- Reset / delete progress for one user (run separately)
-- Service role / SQL editor only. Authenticated app users cannot DELETE.
-- ---------------------------------------------------------------------------
-- delete from public.user_lesson_progress
-- where user_id = 'USER_UUID_HERE';
