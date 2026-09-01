import {
  getOwnedProgramMaterials,
} from "@/lib/content/owned-program";
import { getLocalProgramDetailExtras } from "@/lib/content/program-detail";
import {
  formatCatalogLessons,
} from "@/lib/content/catalog";
import {
  formatLessonPosition,
  getOwnedPrimaryCtaLabel,
  getSectionProgress,
  getVisibleLessonCount,
  resolveOwnedLessons,
} from "@/lib/owned-program/access";
import {
  formatFirstLessonUnlockMessage,
  formatUnlockDate,
  parseTimestamp,
} from "@/lib/owned-program/datetime";
import {
  FIRST_TIME_GUIDANCE,
  formatOnboardingLessonCount,
  formatOnboardingSectionCount,
  getHowItWorksHint,
  getHowItWorksSteps,
} from "@/lib/owned-program/onboarding";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import {
  isFirstTimeProgramUser,
  type ProgramProgressView,
} from "@/lib/progress/helpers";
import type { Program } from "@/lib/programs/types";
import type {
  LessonAccessOptions,
  OwnedProgram,
  OwnedProgramHighlight,
} from "@/types/owned-program";

export function getOwnedProgramHighlights(
  program: OwnedProgram,
): OwnedProgramHighlight[] {
  const lessonCount = getVisibleLessonCount(program);
  const weekCount = program.sections.length;
  const lengthTitle = program.durationLabel
    ? program.durationLabel
    : `${program.totalDays} dni programa`;

  return [
    {
      id: "length",
      icon: "calendar",
      title: lengthTitle,
      description: `${weekCount} tedni, ${lessonCount} lekcij`,
    },
    {
      id: "video",
      icon: "play",
      title: "Video lekcije",
      description: "Kratke, praktične in učinkovite",
    },
    {
      id: "worksheets",
      icon: "file",
      title: "Delovni listi in vaje",
      description: "Na voljo, ko so del lekcije",
    },
    {
      id: "lifetime",
      icon: "infinity",
      title: "Dostop do programa",
      description: "Uči se v svojem ritmu",
    },
  ];
}

export function getOwnedOverviewModel(
  program: OwnedProgram,
  progress: ProgramProgressView,
  identity: Program,
  access?: LessonAccessOptions,
) {
  const currentLesson = progress.continueAvailable
    ? progress.continueLesson
    : undefined;
  const waitingLesson =
    !progress.continueAvailable && !progress.isCompleted
      ? progress.nextIncompleteLesson
      : undefined;
  const currentLessonId = currentLesson?.id ?? "";
  const lessons = resolveOwnedLessons(
    program,
    currentLessonId,
    progress.completedIds,
    access,
  );
  const extras = getLocalProgramDetailExtras(program.slug);
  const visibleLessonCount = getVisibleLessonCount(program);
  const materials = getOwnedProgramMaterials(program);
  const hasCurriculum = program.lessons.length > 0;
  const focusLesson = currentLesson ?? waitingLesson ?? program.lessons[0];
  const isFirstTime = hasCurriculum && isFirstTimeProgramUser(progress);
  const firstLesson = currentLesson ?? waitingLesson;
  const firstLessonSectionTitle = firstLesson
    ? program.sections.find((section) =>
        section.lessonIds.includes(firstLesson.id),
      )?.title
    : undefined;
  const now = access?.now ?? new Date();
  const waitingMessage = waitingLesson
    ? progress.nextUnlockLabel
      ? `Naslednja lekcija bo na voljo ${progress.nextUnlockLabel}.`
      : "Naslednja lekcija še ni na voljo."
    : null;
  const firstLessonUnlockAt = parseTimestamp(progress.nextUnlockAt);
  const firstLessonUnlockMessage =
    isFirstTime && waitingLesson
      ? firstLessonUnlockAt
        ? formatFirstLessonUnlockMessage(firstLessonUnlockAt, now)
        : "Prva lekcija še ni na voljo."
      : null;
  const accessExpiresAt = parseTimestamp(access?.entitlement?.accessExpiresAt);
  const accessExpiresLabel = accessExpiresAt
    ? formatUnlockDate(accessExpiresAt, now)
    : "";
  const accessNote =
    accessExpiresAt &&
    accessExpiresLabel &&
    accessExpiresAt.getTime() > now.getTime()
      ? `Dostop imaš do ${accessExpiresLabel}.`
      : null;

  return {
    program,
    currentLesson,
    waitingLesson,
    firstLesson,
    firstLessonSectionTitle,
    waitingMessage,
    firstLessonUnlockMessage,
    isFirstTime,
    howItWorksSteps: getHowItWorksSteps(program.unlockMode),
    howItWorksHint: getHowItWorksHint(program.unlockMode),
    guidanceLines: [...FIRST_TIME_GUIDANCE],
    lessonCountLabelExact: formatOnboardingLessonCount(visibleLessonCount),
    sectionCountLabel: formatOnboardingSectionCount(program.sections.length),
    accessNote,
    startHereCtaLabel: "Začni prvo lekcijo",
    lessons,
    hasCurriculum,
    progressPercent: progress.progressPercent,
    positionLabel: focusLesson
      ? formatLessonPosition(focusLesson.day, program.totalDays)
      : "Vsebina programa še ni na voljo",
    continueHref: progress.continueHref,
    continueAvailable: progress.continueAvailable,
    overviewHref: getOwnedProgramOverviewPath(program.slug),
    primaryCtaLabel: getOwnedPrimaryCtaLabel(progress.progressPercent),
    isCompleted: progress.isCompleted,
    statusLabel: progress.isCompleted ? "Zaključen" : "V teku",
    completedCount: progress.completedCount,
    visibleLessonCount,
    lessonCountLabel: formatCatalogLessons(visibleLessonCount),
    durationLabel: identity.duration,
    difficulty: identity.difficulty,
    categoryLabel: identity.categoryLabel,
    benefits: extras.benefits,
    highlights: getOwnedProgramHighlights(program),
    materials,
    sectionProgress: getSectionProgress(program, progress.completedIds),
    focusLessonSlug: focusLesson?.slug ?? "",
  };
}

export type OwnedOverviewModel = NonNullable<
  ReturnType<typeof getOwnedOverviewModel>
>;
