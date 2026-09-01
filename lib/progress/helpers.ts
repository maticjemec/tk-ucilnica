import {
  canOpenLesson,
  isOwnedProgramCompleted,
  resolveLessonAccess,
} from "@/lib/owned-program/access";
import {
  formatUnlockDate,
} from "@/lib/owned-program/datetime";
import {
  getOwnedLessonPath,
  getOwnedProgramOverviewPath,
} from "@/lib/owned-program/paths";
import type { UserLessonProgressRow } from "@/lib/progress/types";
import type {
  LessonAccessEntitlement,
  LessonAccessOptions,
  LessonLockedReason,
  OwnedProgram,
  ProgramLesson,
} from "@/types/owned-program";

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

export function formatProgressPercent(value: number) {
  return `${Math.round(Math.min(100, Math.max(0, value)))} %`;
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
 * First incomplete lesson that is currently accessible, by lesson_order.
 * Future drip lessons are skipped. If the next incomplete lesson is still
 * drip-locked (or otherwise inaccessible), returns undefined so callers
 * can keep the overview usable instead of linking to locked content.
 * If every lesson is complete, return the first lesson (replay).
 */
export function getContinueLesson(
  program: OwnedProgram,
  completedIds: ReadonlySet<string>,
  access?: LessonAccessOptions,
): ProgramLesson | undefined {
  const ordered = [...program.lessons].sort((a, b) => a.order - b.order);
  const nextIncompleteAccessible = ordered.find(
    (lesson) =>
      !completedIds.has(lesson.id) &&
      canOpenLesson(program, lesson, completedIds, access),
  );

  if (nextIncompleteAccessible) {
    return nextIncompleteAccessible;
  }

  const hasIncomplete = ordered.some((lesson) => !completedIds.has(lesson.id));

  if (hasIncomplete) {
    return undefined;
  }

  return ordered[0];
}

export function getNextIncompleteLesson(
  program: OwnedProgram,
  completedIds: ReadonlySet<string>,
) {
  return [...program.lessons]
    .sort((a, b) => a.order - b.order)
    .find((lesson) => !completedIds.has(lesson.id));
}

export type ProgramProgressView = {
  completedSlugs: readonly string[];
  completedIds: ReadonlySet<string>;
  completedCount: number;
  totalLessons: number;
  progressPercent: number;
  continueLesson?: ProgramLesson;
  continueHref: string;
  continueAvailable: boolean;
  nextIncompleteLesson?: ProgramLesson;
  nextLockedReason: LessonLockedReason | null;
  nextUnlockAt: string | null;
  nextUnlockLabel: string | null;
  isCompleted: boolean;
};

/**
 * First-time owner: valid curriculum exists and no lesson is completed.
 * last_opened_at is ignored — opening a lesson without completing it is
 * not meaningful progress, and TASK 024 should flip after first completion.
 */
export function isFirstTimeProgramUser(
  progress: Pick<
    ProgramProgressView,
    "completedCount" | "progressPercent" | "isCompleted" | "totalLessons"
  >,
) {
  return (
    progress.totalLessons > 0 &&
    progress.completedCount === 0 &&
    progress.progressPercent === 0 &&
    !progress.isCompleted
  );
}

type OwnedEntryProgress = Pick<
  ProgramProgressView,
  | "completedCount"
  | "progressPercent"
  | "isCompleted"
  | "totalLessons"
  | "continueHref"
>;

/**
 * List/dashboard entry target. First-time owners go to the program
 * overview (onboarding). Active and completed users keep the lesson href.
 */
export function getOwnedEntryHref(
  programSlug: string,
  progress: OwnedEntryProgress,
) {
  if (isFirstTimeProgramUser(progress)) {
    return getFallbackContinueHref(programSlug);
  }

  return progress.continueHref || getFallbackContinueHref(programSlug);
}

export function getOwnedEntryCtaLabel(
  progress: Pick<
    ProgramProgressView,
    "completedCount" | "progressPercent" | "isCompleted" | "totalLessons"
  >,
  kind: "program" | "lesson",
) {
  if (progress.isCompleted) {
    return "Ponovi program";
  }

  if (isFirstTimeProgramUser(progress)) {
    return "Začni program";
  }

  return kind === "lesson" ? "Nadaljuj lekcijo" : "Nadaljuj program";
}

export function buildProgramProgressView(
  program: OwnedProgram,
  rows: readonly UserLessonProgressRow[],
  access?: LessonAccessOptions,
): ProgramProgressView {
  const completedSlugs = getCompletedLessonSlugs(program, rows);
  const completedIds = toCompletedLessonIds(program, completedSlugs);
  const now = access?.now ?? new Date();
  const continueLesson = getContinueLesson(program, completedIds, {
    entitlement: access?.entitlement,
    now,
  });
  const nextIncompleteLesson = getNextIncompleteLesson(program, completedIds);
  const totalLessons = program.lessons.length;
  const completedCount = completedIds.size;
  const progressPercent = getProgramProgressPercent(
    completedCount,
    totalLessons,
  );
  const isCompleted = totalLessons > 0 && isOwnedProgramCompleted(progressPercent);
  const continueAvailable = Boolean(
    continueLesson &&
      (isCompleted || !completedIds.has(continueLesson.id)),
  );

  let nextLockedReason: LessonLockedReason | null = null;
  let nextUnlockAt: string | null = null;
  let nextUnlockLabel: string | null = null;

  if (nextIncompleteLesson && !continueAvailable) {
    const resolution = resolveLessonAccess({
      lesson: nextIncompleteLesson,
      lessons: program.lessons,
      completedIds,
      unlockMode: program.unlockMode,
      entitlement: access?.entitlement,
      now,
    });
    nextLockedReason = resolution.lockedReason;
    nextUnlockAt = resolution.unlockAt?.toISOString() ?? null;
    nextUnlockLabel = resolution.unlockAt
      ? formatUnlockDate(resolution.unlockAt, now)
      : null;
  }

  return {
    completedSlugs,
    completedIds,
    completedCount,
    totalLessons,
    progressPercent,
    continueLesson,
    continueHref:
      continueAvailable && continueLesson
        ? getOwnedLessonPath(program.slug, continueLesson.slug)
        : getFallbackContinueHref(program.slug),
    continueAvailable,
    nextIncompleteLesson,
    nextLockedReason,
    nextUnlockAt,
    nextUnlockLabel,
    isCompleted,
  };
}

export function buildOwnedProgressBySlug(
  programs: readonly OwnedProgram[],
  rows: readonly UserLessonProgressRow[],
  entitlementsBySlug: ReadonlyMap<
    string,
    LessonAccessEntitlement | null | undefined
  > = new Map(),
  now = new Date(),
) {
  const views = new Map<string, ProgramProgressView>();

  for (const program of programs) {
    views.set(
      program.slug,
      buildProgramProgressView(program, rows, {
        entitlement: entitlementsBySlug.get(program.slug) ?? null,
        now,
      }),
    );
  }

  return views;
}

export function getOwnedProgramStatusLabel(progressPercent: number) {
  return isOwnedProgramCompleted(progressPercent) ? "Zaključen" : "V teku";
}

export function getFallbackContinueHref(programSlug: string) {
  return getOwnedProgramOverviewPath(programSlug);
}
