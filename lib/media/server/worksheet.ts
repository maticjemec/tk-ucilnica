import "server-only";

import { resolveLessonMediaAccess } from "@/lib/media/server/access";
import {
  LESSON_MATERIALS_BUCKET,
  SIGNED_MEDIA_URL_EXPIRES_IN,
} from "@/lib/media/server/constants";
import {
  isAuthorizedLessonObjectPath,
  objectFilename,
} from "@/lib/media/server/paths";
import { createAdminClient } from "@/lib/supabase/admin";

function worksheetDownloadName(path: string, lessonSlug: string) {
  const filename = objectFilename(path);

  if (filename && /\.pdf$/i.test(filename)) {
    return filename;
  }

  return `delovni-list-${lessonSlug}.pdf`;
}

/**
 * Short-lived signed worksheet URL for an unlocked, entitled lesson.
 * Expires in 600 seconds. Not persisted. Null if no path or access fails.
 */
export async function getSignedLessonWorksheetUrl(
  programSlug: string,
  lessonSlug: string,
) {
  const access = await resolveLessonMediaAccess(programSlug, lessonSlug);

  if (!access.ok || !access.worksheetPath) {
    return null;
  }

  if (
    !isAuthorizedLessonObjectPath(
      access.worksheetPath,
      access.programSlug,
      access.lessonSlug,
    )
  ) {
    console.error("[media] Rejected unauthorized worksheet object path.");
    return null;
  }

  try {
    const admin = createAdminClient();
    const { data, error } = await admin.storage
      .from(LESSON_MATERIALS_BUCKET)
      .createSignedUrl(access.worksheetPath, SIGNED_MEDIA_URL_EXPIRES_IN, {
        download: worksheetDownloadName(access.worksheetPath, access.lessonSlug),
      });

    if (error || !data?.signedUrl) {
      console.error("[media] Failed to sign lesson worksheet.");
      return null;
    }

    return data.signedUrl;
  } catch {
    console.error("[media] Failed to sign lesson worksheet.");
    return null;
  }
}
