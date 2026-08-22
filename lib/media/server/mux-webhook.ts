import "server-only";

import { LESSON_UUID } from "@/lib/media/server/constants";
import { createAdminClient } from "@/lib/supabase/admin";

type MuxPlaybackId = {
  id?: string;
  policy?: string;
};

type MuxAssetPayload = {
  id?: string;
  passthrough?: string;
  playback_ids?: MuxPlaybackId[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readSignedPlaybackId(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    if (item.policy === "signed" && typeof item.id === "string" && item.id) {
      return item.id;
    }
  }

  return null;
}

function readAssetPayload(data: unknown): MuxAssetPayload | null {
  if (!isRecord(data) || typeof data.id !== "string" || !data.id) {
    return null;
  }

  return {
    id: data.id,
    passthrough:
      typeof data.passthrough === "string" ? data.passthrough : undefined,
    playback_ids: Array.isArray(data.playback_ids)
      ? data.playback_ids
      : undefined,
  };
}

async function findLessonId(asset: MuxAssetPayload) {
  const admin = createAdminClient();

  if (asset.passthrough && LESSON_UUID.test(asset.passthrough)) {
    const { data, error } = await admin
      .from("lessons")
      .select("id")
      .eq("id", asset.passthrough)
      .maybeSingle();

    if (error) {
      console.error("[media] Failed to resolve lesson for Mux webhook.");
      return null;
    }

    if (isRecord(data) && typeof data.id === "string") {
      return data.id;
    }
  }

  if (!asset.id) {
    return null;
  }

  const { data, error } = await admin
    .from("lessons")
    .select("id")
    .eq("video_asset_id", asset.id)
    .maybeSingle();

  if (error) {
    console.error("[media] Failed to resolve lesson for Mux webhook.");
    return null;
  }

  return isRecord(data) && typeof data.id === "string" ? data.id : null;
}

/**
 * Applies a verified Mux asset event to the matching lesson.
 * Call only after webhook signature verification.
 */
export async function applyVerifiedMuxAssetEvent(
  type: string,
  data: unknown,
) {
  if (type !== "video.asset.ready" && type !== "video.asset.errored") {
    return;
  }

  const asset = readAssetPayload(data);

  if (!asset?.id) {
    return;
  }

  const lessonId = await findLessonId(asset);

  if (!lessonId) {
    return;
  }

  const admin = createAdminClient();

  if (type === "video.asset.errored") {
    const { error } = await admin
      .from("lessons")
      .update({
        video_provider: "mux",
        video_asset_id: asset.id,
        video_status: "errored",
      })
      .eq("id", lessonId);

    if (error) {
      console.error("[media] Failed to mark lesson video as errored.");
    }

    return;
  }

  const playbackId = readSignedPlaybackId(asset.playback_ids);

  if (!playbackId) {
    console.error("[media] Mux asset ready without a signed playback ID.");
    const { error } = await admin
      .from("lessons")
      .update({
        video_provider: "mux",
        video_asset_id: asset.id,
        video_status: "errored",
      })
      .eq("id", lessonId);

    if (error) {
      console.error("[media] Failed to mark lesson video as errored.");
    }

    return;
  }

  const { error } = await admin
    .from("lessons")
    .update({
      video_provider: "mux",
      video_asset_id: asset.id,
      video_playback_id: playbackId,
      video_status: "ready",
    })
    .eq("id", lessonId);

  if (error) {
    console.error("[media] Failed to mark lesson video as ready.");
  }
}
