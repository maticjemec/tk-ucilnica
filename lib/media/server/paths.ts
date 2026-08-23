import "server-only";

/**
 * Paths must come from public.lessons and stay under this lesson prefix.
 * Rejects traversal, absolute paths, and other programs' prefixes.
 */
export function isAuthorizedLessonObjectPath(
  path: string,
  programSlug: string,
  lessonSlug: string,
) {
  const trimmed = path.trim();

  if (
    !trimmed ||
    trimmed.startsWith("/") ||
    trimmed.includes("\\") ||
    trimmed.includes("..") ||
    trimmed.includes("//")
  ) {
    return false;
  }

  const prefix = `programs/${programSlug}/lessons/${lessonSlug}/`;

  if (!trimmed.startsWith(prefix)) {
    return false;
  }

  const filename = trimmed.slice(prefix.length);

  return filename.length > 0 && !filename.includes("/") && !filename.includes("\\");
}

const COVER_FILENAMES = new Set(["cover.jpg", "cover.jpeg", "cover.png", "cover.webp"]);

/**
 * Cover objects must be programs/{slug}/cover.{jpg|jpeg|png|webp}.
 * Rejects traversal, absolute paths, and other programs' prefixes.
 */
export function isAuthorizedProgramCoverPath(path: string, programSlug: string) {
  const trimmed = path.trim();

  if (
    !trimmed ||
    trimmed.startsWith("/") ||
    trimmed.includes("\\") ||
    trimmed.includes("..") ||
    trimmed.includes("//")
  ) {
    return false;
  }

  const prefix = `programs/${programSlug}/`;

  if (!trimmed.startsWith(prefix)) {
    return false;
  }

  const filename = trimmed.slice(prefix.length);

  return COVER_FILENAMES.has(filename);
}

export function objectFilename(path: string) {
  const parts = path.trim().split("/");
  return parts[parts.length - 1] || undefined;
}
