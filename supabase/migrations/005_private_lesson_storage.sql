-- TASK 016B — private lesson Storage buckets
-- Audio and worksheets are never public. Signed URLs are issued only by
-- the server-side service-role client after auth + entitlement + unlock.
--
-- Intentionally no storage.objects policies for anon or authenticated.
-- Without SELECT/INSERT/UPDATE/DELETE policies, normal users cannot:
--   list, sign, download via the Storage API, upload, overwrite, or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lesson-audio',
  'lesson-audio',
  false,
  52428800,
  array[
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/wav',
    'audio/x-wav',
    'audio/aac'
  ]
)
on conflict (id) do update
  set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lesson-materials',
  'lesson-materials',
  false,
  20971520,
  array['application/pdf']
)
on conflict (id) do update
  set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
