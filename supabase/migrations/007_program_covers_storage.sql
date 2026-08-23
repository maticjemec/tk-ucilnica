-- TASK 019 — public program cover images
-- Covers are marketing assets. Public read via the bucket public URL.
-- Uploads and deletes stay on the service-role admin path.
-- Intentionally no storage.objects INSERT/UPDATE/DELETE policies for
-- anon or authenticated. Signed upload tokens are created server-side.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'program-covers',
  'program-covers',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
  set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
