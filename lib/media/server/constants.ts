import "server-only";

/** Private Storage bucket for lesson audio. */
export const LESSON_AUDIO_BUCKET = "lesson-audio";

/** Private Storage bucket for lesson PDFs / worksheets. */
export const LESSON_MATERIALS_BUCKET = "lesson-materials";

/** Public Storage bucket for program cover images. */
export const PROGRAM_COVERS_BUCKET = "program-covers";

/**
 * Signed URL lifetime in seconds.
 * Page refresh mints a new URL. No client polling or refresh loop.
 */
export const SIGNED_MEDIA_URL_EXPIRES_IN = 600;

/**
 * Mux playback JWT lifetime.
 * Mux requires expiry longer than the video so HLS is not cut off mid-watch.
 * Lessons do not store asset duration; 2 hours covers typical course videos
 * (about 10–60 minutes) without a multi-day token.
 */
export const MUX_PLAYBACK_TOKEN_EXPIRATION = "2h";

/** Direct Upload URL timeout. Browser uploads go to Mux, not Next.js. */
export const MUX_DIRECT_UPLOAD_TIMEOUT_SECONDS = 3600;

export const IDENTITY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LESSON_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
