export function getOwnedLessonPath(programSlug: string, lessonSlug: string) {
  return `/moji-programi/${programSlug}/lekcija/${lessonSlug}`;
}

/**
 * Owned program overview is not built in TASK 007.
 * Callers should treat a missing overview as a non-link.
 */
export function getOwnedProgramOverviewPath(programSlug: string) {
  if (!programSlug) {
    return undefined;
  }

  // Owned overview `/moji-programi/[slug]` is not built in TASK 007.
  return undefined;
}
