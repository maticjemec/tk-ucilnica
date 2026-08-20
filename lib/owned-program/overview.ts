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
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import type { ProgramProgressView } from "@/lib/progress/helpers";
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
      description: "Prenesi in uporabljaj kadarkoli",
    },
    {
      id: "lifetime",
      icon: "infinity",
      title: "Dostop za vedno",
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
  const waitingMessage = waitingLesson
    ? progress.nextUnlockLabel
      ? `Naslednja lekcija bo na voljo ${progress.nextUnlockLabel}.`
      : "Naslednja lekcija še ni na voljo."
    : null;

  return {
    program,
    currentLesson,
    waitingLesson,
    waitingMessage,
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
