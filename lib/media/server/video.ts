import "server-only";

import { resolveLessonMediaAccess } from "@/lib/media/server/access";
import { MUX_PLAYBACK_TOKEN_EXPIRATION } from "@/lib/media/server/constants";
import { createMuxSigningClient } from "@/lib/mux/client";
import { getMuxSigningCredentials } from "@/lib/mux/env";
import type { LessonMuxPlayback } from "@/lib/media/types";

function hasMuxIdentity(access: {
  videoProvider: string | null;
  videoPlaybackId: string | null;
  videoStatus: string | null;
}) {
  return Boolean(
    access.videoProvider === "mux" ||
      access.videoPlaybackId ||
      access.videoStatus,
  );
}

/**
 * Signed Mux playback for an unlocked, entitled lesson.
 * JWT is not persisted. Null when the lesson has no Mux identity.
 */
export async function getSignedLessonVideoPlayback(
  programSlug: string,
  lessonSlug: string,
): Promise<LessonMuxPlayback | null> {
  const access = await resolveLessonMediaAccess(programSlug, lessonSlug);

  if (!access.ok || !hasMuxIdentity(access)) {
    return null;
  }

  if (access.videoStatus === "preparing") {
    return { state: "preparing" };
  }

  if (access.videoStatus === "errored") {
    return { state: "errored" };
  }

  if (
    access.videoProvider !== "mux" ||
    access.videoStatus !== "ready" ||
    !access.videoPlaybackId
  ) {
    return { state: "unavailable" };
  }

  try {
    const mux = createMuxSigningClient();
    const { keyId, privateKey } = getMuxSigningCredentials();
    const tokens = await mux.jwt.signPlaybackId(access.videoPlaybackId, {
      expiration: MUX_PLAYBACK_TOKEN_EXPIRATION,
      type: ["video", "thumbnail", "storyboard"],
      keyId,
      keySecret: privateKey,
    });

    const playbackToken = tokens["playback-token"];

    if (!playbackToken) {
      console.error("[media] Failed to sign lesson video.");
      return { state: "unavailable" };
    }

    return {
      state: "ready",
      playbackId: access.videoPlaybackId,
      playbackToken,
      thumbnailToken: tokens["thumbnail-token"],
      storyboardToken: tokens["storyboard-token"],
    };
  } catch {
    console.error("[media] Failed to sign lesson video.");
    return { state: "unavailable" };
  }
}
