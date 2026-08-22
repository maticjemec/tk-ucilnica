-- TASK 016A — lesson media identity (Mux + private Storage paths)
-- Do not store playback JWTs or signed URLs in these columns.
-- Existing video_url / audio_url / worksheet_url are kept and marked deprecated.

alter table public.lessons
  add column video_provider text null,
  add column video_playback_id text null,
  add column video_asset_id text null,
  add column video_status text null,
  add column audio_path text null,
  add column worksheet_path text null;

alter table public.lessons
  add constraint lessons_video_provider_check
    check (video_provider is null or video_provider in ('mux')),
  add constraint lessons_video_status_check
    check (video_status is null or video_status in ('preparing', 'ready', 'errored'));

comment on column public.lessons.video_provider is
  'Hosted video provider. mux = Mux signed playback. null = placeholder.';

comment on column public.lessons.video_playback_id is
  'Mux signed playback ID. Not a URL. Not a JWT.';

comment on column public.lessons.video_asset_id is
  'Mux asset ID for upload completion, webhooks, and admin replace.';

comment on column public.lessons.video_status is
  'Mux processing state. Playback only when ready.';

comment on column public.lessons.audio_path is
  'Private Storage object path in bucket lesson-audio. Not a signed URL.';

comment on column public.lessons.worksheet_path is
  'Private Storage object path in bucket lesson-materials. Not a signed URL.';

comment on column public.lessons.video_url is
  'Deprecated. Unused. Do not store Mux IDs, JWTs, or playback URLs here.';

comment on column public.lessons.audio_url is
  'Deprecated. Unused. Store object paths in audio_path.';

comment on column public.lessons.worksheet_url is
  'Deprecated. Unused. Store object paths in worksheet_path.';
