export function getOwnedLessonPath(programSlug: string, lessonSlug: string) {
  return `/moji-programi/${programSlug}/lekcija/${lessonSlug}`;
}

export function isOwnedLessonPath(href: string) {
  return /\/moji-programi\/[^/]+\/lekcija\//.test(href);
}

export function getOwnedProgramOverviewPath(programSlug: string) {
  return `/moji-programi/${programSlug}`;
}
