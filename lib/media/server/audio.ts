import "server-only";

import { resolveLessonMediaAccess } from "@/lib/media/server/access";
import {
  LESSON_AUDIO_BUCKET,
  SIGNED_MEDIA_URL_EXPIRES_IN,
} from "@/lib/media/server/constants";
import { isAuthorizedLessonObjectPath } from "@/lib/media/server/paths";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Short-lived signed audio URL for an unlocked, entitled lesson.
 * Expires in 600 seconds. Not persisted. Null if no path or access fails.
 */
export async function getSignedLessonAudioUrl(
  programSlug: string,
  lessonSlug: string,
) {
  const access = await resolveLessonMediaAccess(programSlug, lessonSlug);

  if (!access.ok || !access.audioPath) {
    return null;
  }

  if (
    !isAuthorizedLessonObjectPath(
      access.audioPath,
      access.programSlug,
      access.lessonSlug,
    )
  ) {
    console.error("[media] Rejected unauthorized audio object path.");
    return null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(LESSON_AUDIO_BUCKET)
      .createSignedUrl(access.audioPath, SIGNED_MEDIA_URL_EXPIRES_IN);

    if (error || !data?.signedUrl) {
      console.error("[media] Failed to sign lesson audio.");
      return null;
    }

    return data.signedUrl;
  } catch {
    console.error("[media] Failed to sign lesson audio.");
    return null;
  }
}
