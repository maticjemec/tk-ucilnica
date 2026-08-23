import "server-only";

import { PROGRAM_COVERS_BUCKET } from "@/lib/media/server/constants";
import { isAuthorizedProgramCoverPath } from "@/lib/media/server/paths";
import { getSupabasePublicEnvOrNull } from "@/lib/supabase/env";

export function programCoverObjectPath(programSlug: string, extension: string) {
  return `programs/${programSlug}/cover.${extension}`;
}

export function programCoverPublicUrl(path: string) {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    return null;
  }

  const base = env.url.replace(/\/+$/, "");
  return `${base}/storage/v1/object/public/${PROGRAM_COVERS_BUCKET}/${path}`;
}

/**
 * Returns the Storage object path only when the URL is this project's
 * program-covers object for the given program. External/manual URLs
 * return null so they are never deleted from Storage.
 */
export function ownedProgramCoverPathFromUrl(
  url: string,
  programSlug: string,
) {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    return null;
  }

  try {
    const base = new URL(env.url);
    const parsed = new URL(url);
    const prefix = `/storage/v1/object/public/${PROGRAM_COVERS_BUCKET}/`;

    if (parsed.protocol !== base.protocol || parsed.hostname !== base.hostname) {
      return null;
    }

    if (base.port && parsed.port !== base.port) {
      return null;
    }

    if (!parsed.pathname.startsWith(prefix)) {
      return null;
    }

    const path = decodeURIComponent(parsed.pathname.slice(prefix.length));

    if (!isAuthorizedProgramCoverPath(path, programSlug)) {
      return null;
    }

    return path;
  } catch {
    return null;
  }
}

export function looksLikeCoverImage(bytes: Uint8Array, extension: string) {
  if (bytes.length < 12) {
    return false;
  }

  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (extension === "png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  if (extension === "webp") {
    return (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    );
  }

  return false;
}
