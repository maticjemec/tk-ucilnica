import {
  getOwnedProgramMaterials,
} from "@/lib/content/owned-program";
import { getProgramBySlug } from "@/lib/content/program-detail";
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
import type {
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
) {
  const currentLesson = progress.continueLesson;
  const lessons = resolveOwnedLessons(
    program,
    currentLesson.id,
    progress.completedIds,
  );
  const detail = getProgramBySlug(program.slug);
  const visibleLessonCount = getVisibleLessonCount(program);
  const materials = getOwnedProgramMaterials(program);

  return {
    program,
    currentLesson,
    lessons,
    progressPercent: progress.progressPercent,
    positionLabel: formatLessonPosition(currentLesson.day, program.totalDays),
    continueHref: progress.continueHref,
    overviewHref: getOwnedProgramOverviewPath(program.slug),
    primaryCtaLabel: getOwnedPrimaryCtaLabel(progress.progressPercent),
    isCompleted: progress.isCompleted,
    statusLabel: progress.isCompleted ? "Zaključen" : "V teku",
    completedCount: progress.completedCount,
    visibleLessonCount,
    lessonCountLabel: formatCatalogLessons(visibleLessonCount),
    durationLabel: program.durationLabel ?? `${program.totalDays} dni`,
    difficulty: detail?.difficulty ?? "Vseh stopenj",
    categoryLabel: detail?.categoryLabel ?? program.label,
    benefits: detail?.benefits ?? [],
    highlights: getOwnedProgramHighlights(program),
    materials,
    sectionProgress: getSectionProgress(program, progress.completedIds),
  };
}

export type OwnedOverviewModel = NonNullable<
  ReturnType<typeof getOwnedOverviewModel>
>;
