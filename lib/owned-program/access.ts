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

export function isLessonUnlocked(
  lesson: ProgramLesson,
  lessons: ProgramLesson[],
  completedIds: ReadonlySet<string>,
  unlockMode: ProgramUnlockMode,
) {
  if (unlockMode === "all") {
    return true;
  }

  // "drip" stays sequential until a later task computes unlockAt / dayOffset.
  const previous = lessons.filter((item) => item.day < lesson.day);
  return previous.every((item) => completedIds.has(item.id));
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
  const index = lessons.findIndex((lesson) => lesson.slug === lessonSlug);

  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next:
      index >= 0 && index < lessons.length - 1
        ? lessons[index + 1]
        : undefined,
  };
}

/**
 * Keep the seeded mock percent until the learner completes extra lessons.
 * Later this becomes completedCount / totalDays from user_lesson_progress.
 */
export function getLocalProgressPercent(options: {
  completedCount: number;
  initialCompletedCount: number;
  totalDays: number;
  seedPercent: number;
}) {
  const { completedCount, initialCompletedCount, totalDays, seedPercent } =
    options;
  const added = completedCount - initialCompletedCount;

  if (added <= 0) {
    return seedPercent;
  }

  return Math.min(
    100,
    seedPercent + Math.round((added / Math.max(totalDays, 1)) * 100),
  );
}

export function getVisibleLessonCount(program: OwnedProgram) {
  const ids = new Set(program.sections.flatMap((section) => section.lessonIds));
  return ids.size;
}
