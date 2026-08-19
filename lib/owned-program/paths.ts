export function getOwnedLessonPath(programSlug: string, lessonSlug: string) {
  return `/moji-programi/${programSlug}/lekcija/${lessonSlug}`;
}

export function getOwnedProgramOverviewPath(programSlug: string) {
  return `/moji-programi/${programSlug}`;
}
