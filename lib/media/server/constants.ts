import "server-only";

/** Private Storage bucket for lesson audio. */
export const LESSON_AUDIO_BUCKET = "lesson-audio";

/** Private Storage bucket for lesson PDFs / worksheets. */
export const LESSON_MATERIALS_BUCKET = "lesson-materials";

/**
 * Signed URL lifetime in seconds.
 * Page refresh mints a new URL. No client polling or refresh loop.
 */
export const SIGNED_MEDIA_URL_EXPIRES_IN = 600;

export const IDENTITY_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
