import "server-only";

import { revalidateAdminLesson } from "@/lib/admin/revalidate";
import { LESSON_UUID } from "@/lib/media/server/constants";
import { createMuxClient } from "@/lib/mux/client";
import { createAdminClient } from "@/lib/supabase/admin";

type MuxPlaybackId = {
  id?: string;
  policy?: string;
};

type MuxAssetPayload = {
  id: string;
  status?: string;
  passthrough?: string;
  playback_ids?: MuxPlaybackId[];
};

export type AppliedMuxVideoStatus = "ready" | "preparing" | "errored";

export type ApplyMuxAssetResult =
  | { ok: true; status: AppliedMuxVideoStatus }
  | { ok: false; reason: "not_found" | "persist_failed" };

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
    status: typeof data.status === "string" ? data.status : undefined,
    passthrough:
      typeof data.passthrough === "string" ? data.passthrough : undefined,
    playback_ids: Array.isArray(data.playback_ids)
      ? data.playback_ids
      : undefined,
  };
}

function readProgramSlug(value: unknown) {
  if (isRecord(value) && typeof value.slug === "string" && value.slug) {
    return value.slug;
  }

  if (
    Array.isArray(value) &&
    isRecord(value[0]) &&
    typeof value[0].slug === "string" &&
    value[0].slug
  ) {
    return value[0].slug;
  }

  return null;
}

function resolvePersistMode(
  force: "ready" | "errored" | undefined,
  status: string | undefined,
): AppliedMuxVideoStatus {
  if (force) {
    return force;
  }

  if (status === "ready") {
    return "ready";
  }

  if (status === "errored") {
    return "errored";
  }

  return "preparing";
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

async function revalidateLessonById(lessonId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("lessons")
    .select("slug, programs!inner ( slug )")
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !isRecord(data) || typeof data.slug !== "string") {
    return;
  }

  const programSlug = readProgramSlug(data.programs);

  if (!programSlug) {
    return;
  }

  revalidateAdminLesson(programSlug, data.slug);
}

async function persistLessonVideo(
  lessonId: string,
  assetId: string,
  mode: AppliedMuxVideoStatus,
  playbackId: string | null,
) {
  const admin = createAdminClient();

  if (mode === "ready") {
    if (!playbackId) {
      console.error("[media] Mux asset ready without a signed playback ID.");
      const { error } = await admin
        .from("lessons")
        .update({
          video_provider: "mux",
          video_asset_id: assetId,
          video_status: "errored",
        })
        .eq("id", lessonId);

      if (error) {
        console.error("[media] Failed to mark lesson video as errored.");
        return { ok: false as const, status: "errored" as const };
      }

      return { ok: true as const, status: "errored" as const };
    }

    const { error } = await admin
      .from("lessons")
      .update({
        video_provider: "mux",
        video_asset_id: assetId,
        video_playback_id: playbackId,
        video_status: "ready",
      })
      .eq("id", lessonId);

    if (error) {
      console.error("[media] Failed to mark lesson video as ready.");
      return { ok: false as const, status: "ready" as const };
    }

    return { ok: true as const, status: "ready" as const };
  }

  const { error } = await admin
    .from("lessons")
    .update({
      video_provider: "mux",
      video_asset_id: assetId,
      video_status: mode,
    })
    .eq("id", lessonId);

  if (error) {
    console.error(
      mode === "errored"
        ? "[media] Failed to mark lesson video as errored."
        : "[media] Failed to mark lesson video as preparing.",
    );
    return { ok: false as const, status: mode };
  }

  return { ok: true as const, status: mode };
}

/**
 * Applies a Mux asset payload to the matching lesson.
 * Shared by the verified webhook and admin reconcile.
 */
export async function applyMuxAssetRecordToLesson(
  data: unknown,
  force?: "ready" | "errored",
): Promise<ApplyMuxAssetResult> {
  const asset = readAssetPayload(data);

  if (!asset) {
    return { ok: false, reason: "not_found" };
  }

  const lessonId = await findLessonId(asset);

  if (!lessonId) {
    return { ok: false, reason: "not_found" };
  }

  const mode = resolvePersistMode(force, asset.status);
  const playbackId = mode === "ready" ? readSignedPlaybackId(asset.playback_ids) : null;
  const persisted = await persistLessonVideo(lessonId, asset.id, mode, playbackId);

  if (!persisted.ok) {
    return { ok: false, reason: "persist_failed" };
  }

  await revalidateLessonById(lessonId);
  return { ok: true, status: persisted.status };
}

async function applyUploadAssetCreated(data: unknown) {
  if (!isRecord(data) || typeof data.asset_id !== "string" || !data.asset_id) {
    return;
  }

  try {
    const mux = createMuxClient();
    const asset = await mux.video.assets.retrieve(data.asset_id);
    await applyMuxAssetRecordToLesson(asset);
  } catch {
    console.error("[media] Failed to load Mux asset for upload event.");
  }
}

/**
 * Applies a verified Mux asset event to the matching lesson.
 * Call only after webhook signature verification.
 */
export async function applyVerifiedMuxAssetEvent(
  type: string,
  data: unknown,
) {
  if (type === "video.upload.asset_created") {
    await applyUploadAssetCreated(data);
    return;
  }

  if (type === "video.asset.ready") {
    await applyMuxAssetRecordToLesson(data, "ready");
    return;
  }

  if (type === "video.asset.errored") {
    await applyMuxAssetRecordToLesson(data, "errored");
  }
}
