import {
  getOwnedLessonPath,
  getOwnedProgramOverviewPath,
} from "@/lib/owned-program/paths";
import type { UserLessonProgressRow } from "@/lib/progress/types";
import type { OwnedProgram, ProgramLesson } from "@/types/owned-program";
import { canOpenLesson, isOwnedProgramCompleted } from "@/lib/owned-program/access";

export const PROGRESS_SAVE_ERROR =
  "Napredka ni bilo mogoče shraniti. Poskusi znova.";

/**
 * Single progress-percentage helper.
 * completedCount / totalLessons, rounded, clamped to 0–100.
 */
export function getProgramProgressPercent(
  completedCount: number,
  totalLessons: number,
) {
  if (totalLessons <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((completedCount / totalLessons) * 100)),
  );
}

export function getAverageOwnedProgressPercent(percents: readonly number[]) {
  if (percents.length === 0) {
    return 0;
  }

  const total = percents.reduce((sum, value) => sum + value, 0);
  return Math.round(total / percents.length);
}

export function getCompletedLessonSlugs(
  program: OwnedProgram,
  rows: readonly UserLessonProgressRow[],
) {
  const knownSlugs = new Set(program.lessons.map((lesson) => lesson.slug));

  return rows
    .filter(
      (row) =>
        row.program_slug === program.slug &&
        row.completed &&
        knownSlugs.has(row.lesson_slug),
    )
    .map((row) => row.lesson_slug);
}

export function toCompletedLessonIds(
  program: OwnedProgram,
  completedSlugs: readonly string[],
) {
  const slugSet = new Set(completedSlugs);

  return new Set(
    program.lessons
      .filter((lesson) => slugSet.has(lesson.slug))
      .map((lesson) => lesson.id),
  );
}

/**
 * First incomplete accessible lesson.
 * If every lesson is complete, return the first lesson (replay).
 */
export function getContinueLesson(
  program: OwnedProgram,
  completedIds: ReadonlySet<string>,
): ProgramLesson | undefined {
  const nextIncomplete = program.lessons.find(
    (lesson) =>
      !completedIds.has(lesson.id) && canOpenLesson(program, lesson, completedIds),
  );

  return nextIncomplete ?? program.lessons[0];
}

export type ProgramProgressView = {
  completedSlugs: readonly string[];
  completedIds: ReadonlySet<string>;
  completedCount: number;
  totalLessons: number;
  progressPercent: number;
  continueLesson: ProgramLesson;
  continueHref: string;
  isCompleted: boolean;
};

export function buildProgramProgressView(
  program: OwnedProgram,
  rows: readonly UserLessonProgressRow[],
): ProgramProgressView | undefined {
  const completedSlugs = getCompletedLessonSlugs(program, rows);
  const completedIds = toCompletedLessonIds(program, completedSlugs);
  const continueLesson = getContinueLesson(program, completedIds);

  if (!continueLesson) {
    return undefined;
  }

  const totalLessons = program.lessons.length;
  const completedCount = completedIds.size;
  const progressPercent = getProgramProgressPercent(
    completedCount,
    totalLessons,
  );

  return {
    completedSlugs,
    completedIds,
    completedCount,
    totalLessons,
    progressPercent,
    continueLesson,
    continueHref: getOwnedLessonPath(program.slug, continueLesson.slug),
    isCompleted: isOwnedProgramCompleted(progressPercent),
  };
}

export function buildOwnedProgressBySlug(
  programs: readonly OwnedProgram[],
  rows: readonly UserLessonProgressRow[],
) {
  const views = new Map<string, ProgramProgressView>();

  for (const program of programs) {
    const view = buildProgramProgressView(program, rows);

    if (view) {
      views.set(program.slug, view);
    }
  }

  return views;
}

export function getOwnedProgramStatusLabel(progressPercent: number) {
  return isOwnedProgramCompleted(progressPercent) ? "Zaključen" : "V teku";
}

export function getFallbackContinueHref(programSlug: string) {
  return getOwnedProgramOverviewPath(programSlug);
}
