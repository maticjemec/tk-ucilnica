import { isEntitlementCurrentlyValid } from "@/lib/auth/entitlements";
import {
  formatDripAvailabilityLabel,
  parseTimestamp,
  addUtcDays,
} from "@/lib/owned-program/datetime";
import { getOwnedLessonPath } from "@/lib/owned-program/paths";
import type {
  LessonAccessEntitlement,
  LessonAccessOptions,
  LessonAccessResolution,
  LessonAccessState,
  LessonLockedReason,
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

export function resolveEffectiveUnlockMode(
  lesson: ProgramLesson,
  programUnlockMode: ProgramUnlockMode,
): ProgramUnlockMode {
  return lesson.unlockMode ?? programUnlockMode;
}

function arePrerequisitesComplete(
  lesson: ProgramLesson,
  lessons: ProgramLesson[],
  completedIds: ReadonlySet<string>,
) {
  return lessons
    .filter((item) => item.order < lesson.order)
    .every((item) => completedIds.has(item.id));
}

/**
 * Drip unlock time, UTC.
 *
 * Priority for unlock_mode = "drip":
 * 1. explicit lessons.unlock_at
 * 2. user_programs.granted_at + lessons.day_offset
 * 3. neither (or unparsable) → null, caller must fail closed
 *
 * day_offset is whole UTC days, keeping the granted_at clock time.
 * Example: granted_at 2026-08-20 10:00 + day_offset 2 → 2026-08-22 10:00.
 */
export function resolveDripUnlockAt(
  lesson: ProgramLesson,
  entitlement?: LessonAccessEntitlement | null,
): Date | null {
  const explicit = parseTimestamp(lesson.drip?.unlockAt);

  if (lesson.drip?.unlockAt) {
    return explicit;
  }

  if (lesson.drip?.dayOffset == null) {
    return null;
  }

  const grantedAt = parseTimestamp(entitlement?.grantedAt);

  if (!grantedAt) {
    return null;
  }

  return addUtcDays(grantedAt, lesson.drip.dayOffset);
}

function resolveDripGate(
  lesson: ProgramLesson,
  entitlement: LessonAccessEntitlement | null | undefined,
  now: Date,
): { unlockAt: Date | null; locked: boolean } {
  const unlockAt = resolveDripUnlockAt(lesson, entitlement);

  if (!unlockAt) {
    return { unlockAt: null, locked: true };
  }

  return {
    unlockAt,
    locked: now.getTime() < unlockAt.getTime(),
  };
}

/**
 * Authoritative lesson-access resolver.
 *
 * Modes:
 * - all: published lesson is available immediately
 * - sequential: available when every earlier lesson is completed
 * - drip: available when drip time has arrived AND sequential
 *   prerequisites are completed
 *
 * A lesson with unlock_mode = "all" skips both drip and sequential gates.
 * Drip never bypasses unfinished prerequisites.
 *
 * Entitlement expiry is checked here as defense in depth. Owned routes
 * already reject expired access via requireProgramEntitlement.
 *
 * `now` must be server time for authorization. Client UI may call this
 * with a local clock only to refresh sequential rows after completion.
 *
 * Unpublished lessons are omitted from owned curriculum assembly and 404
 * before this resolver runs. lockedReason "unpublished" is reserved if a
 * caller ever passes an unpublished row.
 */
export function resolveLessonAccess(options: {
  lesson: ProgramLesson;
  lessons: ProgramLesson[];
  completedIds: ReadonlySet<string>;
  unlockMode: ProgramUnlockMode;
  entitlement?: LessonAccessEntitlement | null;
  now?: Date;
  currentLessonId?: string;
}): LessonAccessResolution {
  const now = options.now ?? new Date();
  const entitlement = options.entitlement ?? null;
  const mode = resolveEffectiveUnlockMode(options.lesson, options.unlockMode);

  if (
    entitlement &&
    !isEntitlementCurrentlyValid(entitlement.accessExpiresAt, now)
  ) {
    return {
      status: "locked",
      lockedReason: "entitlement-expired",
      unlockAt: null,
      canOpen: false,
    };
  }

  let dripUnlockAt: Date | null = null;
  let dripLocked = false;

  if (mode === "drip") {
    const gate = resolveDripGate(options.lesson, entitlement, now);
    dripUnlockAt = gate.unlockAt;
    dripLocked = gate.locked;
  }

  const prerequisitesComplete =
    mode === "all" ||
    arePrerequisitesComplete(options.lesson, options.lessons, options.completedIds);

  const gatesOpen =
    mode === "all"
      ? true
      : mode === "drip"
        ? !dripLocked && prerequisitesComplete
        : prerequisitesComplete;

  const completed = options.completedIds.has(options.lesson.id);
  const canOpen = completed || gatesOpen;

  if (!canOpen) {
    const lockedReason: LessonLockedReason = dripLocked
      ? "drip-time"
      : "prerequisite";

    return {
      status: "locked",
      lockedReason,
      unlockAt: dripUnlockAt,
      canOpen: false,
    };
  }

  if (completed) {
    return {
      status: "completed",
      lockedReason: null,
      unlockAt: dripUnlockAt,
      canOpen: true,
    };
  }

  if (options.currentLessonId && options.lesson.id === options.currentLessonId) {
    return {
      status: "current",
      lockedReason: null,
      unlockAt: dripUnlockAt,
      canOpen: true,
    };
  }

  return {
    status: "available",
    lockedReason: null,
    unlockAt: dripUnlockAt,
    canOpen: true,
  };
}

export function isLessonUnlocked(
  lesson: ProgramLesson,
  lessons: ProgramLesson[],
  completedIds: ReadonlySet<string>,
  unlockMode: ProgramUnlockMode,
  access?: LessonAccessOptions,
) {
  return resolveLessonAccess({
    lesson,
    lessons,
    completedIds,
    unlockMode,
    entitlement: access?.entitlement,
    now: access?.now,
  }).canOpen;
}

export function canOpenLesson(
  program: OwnedProgram,
  lesson: ProgramLesson,
  completedIds: ReadonlySet<string>,
  access?: LessonAccessOptions,
) {
  return resolveLessonAccess({
    lesson,
    lessons: program.lessons,
    completedIds,
    unlockMode: program.unlockMode,
    entitlement: access?.entitlement,
    now: access?.now,
  }).canOpen;
}

export function getLessonAccessState(options: {
  lesson: ProgramLesson;
  lessons: ProgramLesson[];
  currentLessonId: string;
  completedIds: ReadonlySet<string>;
  unlockMode: ProgramUnlockMode;
  entitlement?: LessonAccessEntitlement | null;
  now?: Date;
}): LessonAccessState {
  return resolveLessonAccess(options).status;
}

function toResolvedLesson(
  programSlug: string,
  lesson: ProgramLesson,
  resolution: LessonAccessResolution,
  now: Date,
): ResolvedLesson {
  const unlockLabel =
    resolution.lockedReason === "drip-time"
      ? resolution.unlockAt
        ? formatDripAvailabilityLabel(resolution.unlockAt, now)
        : "Na voljo kmalu"
      : null;

  return {
    ...lesson,
    accessState: resolution.status,
    completed: resolution.status === "completed",
    locked: resolution.status === "locked",
    href: getOwnedLessonPath(programSlug, lesson.slug),
    lockedReason: resolution.lockedReason,
    unlockAt: resolution.unlockAt?.toISOString() ?? null,
    unlockLabel,
  };
}

export function resolveOwnedLessons(
  program: OwnedProgram,
  currentLessonId: string,
  completedIds: ReadonlySet<string>,
  access?: LessonAccessOptions,
): ResolvedLesson[] {
  const now = access?.now ?? new Date();

  return program.lessons.map((lesson) => {
    const resolution = resolveLessonAccess({
      lesson,
      lessons: program.lessons,
      currentLessonId,
      completedIds,
      unlockMode: program.unlockMode,
      entitlement: access?.entitlement,
      now,
    });

    return toResolvedLesson(program.slug, lesson, resolution, now);
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
  access?: LessonAccessOptions,
) {
  const ordered = orderedLessons(program.lessons);
  const index = ordered.findIndex((lesson) => lesson.slug === lessonSlug);

  if (index < 0) {
    return { previous: undefined, next: undefined };
  }

  let previous: ProgramLesson | undefined;
  for (let i = index - 1; i >= 0; i -= 1) {
    if (canOpenLesson(program, ordered[i], completedIds, access)) {
      previous = ordered[i];
      break;
    }
  }

  let next: ProgramLesson | undefined;
  for (let i = index + 1; i < ordered.length; i += 1) {
    if (canOpenLesson(program, ordered[i], completedIds, access)) {
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
