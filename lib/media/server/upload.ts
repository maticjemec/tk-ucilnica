import "server-only";

import {
  LESSON_UUID,
  MUX_DIRECT_UPLOAD_TIMEOUT_SECONDS,
} from "@/lib/media/server/constants";
import { createMuxClient } from "@/lib/mux/client";
import { createAdminClient } from "@/lib/supabase/admin";

export type LessonVideoDirectUpload = {
  uploadId: string;
  uploadUrl: string;
  timeoutSeconds: number;
};

/**
 * Creates a Mux Direct Upload for a lesson.
 *
 * Correlation: new_asset_settings.passthrough = lesson UUID.
 * Playback policy is always signed. video_quality plus targets 1080p HLS.
 * Unwired — no public/admin route. Call only from a future authorized admin flow.
 */
export async function createLessonVideoDirectUpload(options: {
  lessonId: string;
  corsOrigin: string;
}): Promise<LessonVideoDirectUpload> {
  if (!LESSON_UUID.test(options.lessonId)) {
    throw new Error("Invalid lesson id.");
  }

  const corsOrigin = options.corsOrigin.trim();

  if (!corsOrigin) {
    throw new Error("Missing upload CORS origin.");
  }

  const mux = createMuxClient();
  const upload = await mux.video.uploads.create({
    cors_origin: corsOrigin,
    timeout: MUX_DIRECT_UPLOAD_TIMEOUT_SECONDS,
    new_asset_settings: {
      playback_policies: ["signed"],
      video_quality: "plus",
      passthrough: options.lessonId,
    },
  });

  if (!upload.url) {
    throw new Error("Mux did not return an upload URL.");
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("lessons")
    .update({
      video_provider: "mux",
      video_status: "preparing",
    })
    .eq("id", options.lessonId);

  if (error) {
    console.error("[media] Failed to mark lesson video as preparing.");
  }

  return {
    uploadId: upload.id,
    uploadUrl: upload.url,
    timeoutSeconds: upload.timeout ?? MUX_DIRECT_UPLOAD_TIMEOUT_SECONDS,
  };
}
