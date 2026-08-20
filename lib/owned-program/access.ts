import { getOwnedLessonPath } from "@/lib/owned-program/paths";
import type {
  LessonAccessState,
  OwnedProgram,
  ProgramLesson,
  ProgramUnlockMode,
  ResolvedLesson,
} from "@/types/owned-program";

export function formatLessonHeading(lesson: Pick<ProgramLesson, "day" | "title">) {
  return `Dan ${lesson.day}: ${lesson.title}`;
}

export function formatLessonPosition(day: number, totalDays: number) {
  return `Dan ${day} od ${totalDays}`;
}

export function formatTimecode(totalSeconds: number) {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function orderedLessons(lessons: ProgramLesson[]) {
  return [...lessons].sort((a, b) => a.order - b.order);
}

export function isLessonUnlocked(
  lesson: ProgramLesson,
  lessons: ProgramLesson[],
  completedIds: ReadonlySet<string>,
  unlockMode: ProgramUnlockMode,
) {
  const mode = lesson.unlockMode ?? unlockMode;

  if (mode === "all") {
    return true;
  }

  // "drip" stays sequential until TASK 014 computes unlockAt / dayOffset.
  const previous = lessons.filter((item) => item.order < lesson.order);
  return previous.every((item) => completedIds.has(item.id));
}

export function canOpenLesson(
  program: OwnedProgram,
  lesson: ProgramLesson,
  completedIds: ReadonlySet<string>,
) {
  return (
    completedIds.has(lesson.id) ||
    isLessonUnlocked(
      lesson,
      program.lessons,
      completedIds,
      program.unlockMode,
    )
  );
}

export function getLessonAccessState(options: {
  lesson: ProgramLesson;
  lessons: ProgramLesson[];
  currentLessonId: string;
  completedIds: ReadonlySet<string>;
  unlockMode: ProgramUnlockMode;
}): LessonAccessState {
  const { lesson, lessons, currentLessonId, completedIds, unlockMode } =
    options;

  if (completedIds.has(lesson.id)) {
    return "completed";
  }

  if (lesson.id === currentLessonId) {
    return "current";
  }

  if (isLessonUnlocked(lesson, lessons, completedIds, unlockMode)) {
    return "available";
  }

  return "locked";
}

export function resolveOwnedLessons(
  program: OwnedProgram,
  currentLessonId: string,
  completedIds: ReadonlySet<string>,
): ResolvedLesson[] {
  return program.lessons.map((lesson) => {
    const accessState = getLessonAccessState({
      lesson,
      lessons: program.lessons,
      currentLessonId,
      completedIds,
      unlockMode: program.unlockMode,
    });

    return {
      ...lesson,
      accessState,
      completed: accessState === "completed",
      locked: accessState === "locked",
      href: getOwnedLessonPath(program.slug, lesson.slug),
    };
  });
}

export function getAdjacentLessons(
  lessons: ProgramLesson[],
  lessonSlug: string,
) {
  const ordered = orderedLessons(lessons);
  const index = ordered.findIndex((lesson) => lesson.slug === lessonSlug);

  return {
    previous: index > 0 ? ordered[index - 1] : undefined,
    next:
      index >= 0 && index < ordered.length - 1
        ? ordered[index + 1]
        : undefined,
  };
}

export function getAccessibleAdjacentLessons(
  program: OwnedProgram,
  lessonSlug: string,
  completedIds: ReadonlySet<string>,
) {
  const ordered = orderedLessons(program.lessons);
  const index = ordered.findIndex((lesson) => lesson.slug === lessonSlug);

  if (index < 0) {
    return { previous: undefined, next: undefined };
  }

  let previous: ProgramLesson | undefined;
  for (let i = index - 1; i >= 0; i -= 1) {
    if (canOpenLesson(program, ordered[i], completedIds)) {
      previous = ordered[i];
      break;
    }
  }

  let next: ProgramLesson | undefined;
  for (let i = index + 1; i < ordered.length; i += 1) {
    if (canOpenLesson(program, ordered[i], completedIds)) {
      next = ordered[i];
      break;
    }
  }

  return { previous, next };
}

export function getVisibleLessonCount(program: OwnedProgram) {
  if (program.lessons.length > 0) {
    return program.lessons.length;
  }

  const ids = new Set(program.sections.flatMap((section) => section.lessonIds));
  return ids.size;
}

export function isOwnedProgramCompleted(progressPercent: number) {
  return progressPercent >= 100;
}

export function getOwnedPrimaryCtaLabel(progressPercent: number) {
  return isOwnedProgramCompleted(progressPercent)
    ? "Ponovi program"
    : "Nadaljuj program";
}

export function formatSectionProgress(completed: number, total: number) {
  return `${completed} od ${total} opravljenih`;
}

export function getSectionProgress(
  program: OwnedProgram,
  completedIds: ReadonlySet<string>,
) {
  const knownIds = new Set(program.lessons.map((lesson) => lesson.id));

  return program.sections.map((section) => {
    const lessonIds = section.lessonIds.filter((id) => knownIds.has(id));
    const completed = lessonIds.filter((id) => completedIds.has(id)).length;

    return {
      sectionId: section.id,
      completed,
      total: lessonIds.length,
      label: formatSectionProgress(completed, lessonIds.length),
    };
  });
}

export function getLessonAccessLabel(state: LessonAccessState) {
  switch (state) {
    case "completed":
      return "opravljeno";
    case "current":
      return "trenutna lekcija";
    case "available":
      return "na voljo";
    case "locked":
      return "zaklenjeno";
  }
}
