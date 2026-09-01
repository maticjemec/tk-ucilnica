import "server-only";

import { applyMuxAssetRecordToLesson } from "@/lib/media/server/mux-webhook";
import { createMuxClient } from "@/lib/mux/client";

const MAX_ASSET_SCAN = 100;

export type ReconciledMuxVideoStatus =
  | "ready"
  | "preparing"
  | "errored"
  | "missing";

function createdAtValue(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value) {
    const numeric = Number(value);

    if (Number.isFinite(numeric)) {
      return numeric;
    }

    const parsed = Date.parse(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

async function findMuxAssetForLesson(
  lessonId: string,
  storedAssetId: string | null,
) {
  const mux = createMuxClient();

  if (storedAssetId) {
    try {
      return await mux.video.assets.retrieve(storedAssetId);
    } catch {
      console.error("[media] Stored Mux asset could not be retrieved.");
    }
  }

  let match: Awaited<ReturnType<typeof mux.video.assets.retrieve>> | null = null;
  let scannedUploads = 0;

  for await (const upload of mux.video.uploads.list({ limit: 25 })) {
    scannedUploads += 1;

    if (
      upload.new_asset_settings?.passthrough === lessonId &&
      typeof upload.asset_id === "string" &&
      upload.asset_id
    ) {
      try {
        return await mux.video.assets.retrieve(upload.asset_id);
      } catch {
        console.error("[media] Mux upload asset could not be retrieved.");
      }
    }

    if (scannedUploads >= MAX_ASSET_SCAN) {
      break;
    }
  }

  let scanned = 0;

  for await (const asset of mux.video.assets.list({ limit: 25 })) {
    scanned += 1;

    if (asset.passthrough === lessonId) {
      if (!match || createdAtValue(asset.created_at) > createdAtValue(match.created_at)) {
        match = asset;
      }
    }

    if (scanned >= MAX_ASSET_SCAN) {
      break;
    }
  }

  return match;
}

/**
 * Queries Mux and writes the current asset state onto the lesson.
 * Admin-only fallback when the webhook did not arrive.
 */
export async function reconcileLessonMuxVideo(options: {
  lessonId: string;
  storedAssetId: string | null;
}): Promise<ReconciledMuxVideoStatus> {
  const asset = await findMuxAssetForLesson(
    options.lessonId,
    options.storedAssetId,
  );

  if (!asset) {
    return "missing";
  }

  const applied = await applyMuxAssetRecordToLesson(asset);

  if (!applied.ok) {
    throw new Error("Failed to persist Mux video status.");
  }

  return applied.status;
}
