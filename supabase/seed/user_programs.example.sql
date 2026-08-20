-- Manual test seed for public.user_programs
-- Replace USER_UUID_HERE with an auth.users id from Authentication > Users.
-- Do not commit real user UUIDs into migrations.
--
-- Currently supported program_slug values:
--   21-dni-do-manj-anksioznosti
--   21-dni-do-boljse-samozavesti
--   najdi-sebe
--   samohipnoza-v-praksi
--
-- Run the INSERT block and the DELETE block separately.

-- ---------------------------------------------------------------------------
-- Grant two programs (example for the "user with 2 entitlements" test matrix)
-- ---------------------------------------------------------------------------
insert into public.user_programs (user_id, program_slug, source)
values
  ('USER_UUID_HERE', '21-dni-do-boljse-samozavesti', 'manual'),
  ('USER_UUID_HERE', 'najdi-sebe', 'manual')
on conflict (user_id, program_slug) do nothing;

-- Optional: grant all four programs to a different test user
-- insert into public.user_programs (user_id, program_slug, source)
-- values
--   ('USER_UUID_HERE', '21-dni-do-manj-anksioznosti', 'manual'),
--   ('USER_UUID_HERE', '21-dni-do-boljse-samozavesti', 'manual'),
--   ('USER_UUID_HERE', 'najdi-sebe', 'manual'),
--   ('USER_UUID_HERE', 'samohipnoza-v-praksi', 'manual')
-- on conflict (user_id, program_slug) do nothing;

-- Optional: expired entitlement (must behave as not owned)
-- insert into public.user_programs (
--   user_id,
--   program_slug,
--   source,
--   access_expires_at
-- )
-- values (
--   'USER_UUID_HERE',
--   'samohipnoza-v-praksi',
--   'manual',
--   now() - interval '1 day'
-- )
-- on conflict (user_id, program_slug) do nothing;

-- ---------------------------------------------------------------------------
-- Reset / delete entitlements for one user (run separately)
-- ---------------------------------------------------------------------------
-- delete from public.user_programs
-- where user_id = 'USER_UUID_HERE';
