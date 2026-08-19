import {
  getOwnedProgramMaterials,
} from "@/lib/content/owned-program";
import { getProgramBySlug } from "@/lib/content/program-detail";
import {
  formatCatalogLessons,
} from "@/lib/content/catalog";
import {
  formatLessonPosition,
  getCurrentOwnedLesson,
  getLocalProgressPercent,
  getOwnedPrimaryCtaLabel,
  getSectionProgress,
  getVisibleLessonCount,
  isOwnedProgramCompleted,
  resolveOwnedLessons,
} from "@/lib/owned-program/access";
import {
  getOwnedLessonPath,
  getOwnedProgramOverviewPath,
} from "@/lib/owned-program/paths";
import type {
  OwnedProgram,
  OwnedProgramHighlight,
} from "@/types/owned-program";

export function getOwnedProgramHighlights(
  program: OwnedProgram,
): OwnedProgramHighlight[] {
  const lessonCount = getVisibleLessonCount(program);
  const weekCount = program.sections.length;

  return [
    {
      id: "length",
      icon: "calendar",
      title: `${program.totalDays} dni programa`,
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

export function getOwnedOverviewModel(program: OwnedProgram) {
  const currentLesson = getCurrentOwnedLesson(program);

  if (!currentLesson) {
    return undefined;
  }

  const completedIds = new Set(program.initialCompletedLessonIds);
  const lessons = resolveOwnedLessons(program, currentLesson.id, completedIds);
  const progressPercent = getLocalProgressPercent({
    completedCount: completedIds.size,
    initialCompletedCount: program.initialCompletedLessonIds.length,
    totalDays: program.totalDays,
    seedPercent: program.progress,
  });
  const detail = getProgramBySlug(program.slug);
  const visibleLessonCount = getVisibleLessonCount(program);
  const materials = getOwnedProgramMaterials(program);
  const completed = isOwnedProgramCompleted(progressPercent);

  return {
    program,
    currentLesson,
    lessons,
    progressPercent,
    positionLabel: formatLessonPosition(currentLesson.day, program.totalDays),
    continueHref: getOwnedLessonPath(program.slug, currentLesson.slug),
    overviewHref: getOwnedProgramOverviewPath(program.slug),
    primaryCtaLabel: getOwnedPrimaryCtaLabel(progressPercent),
    isCompleted: completed,
    statusLabel: completed ? "Zaključen" : "V teku",
    completedCount: completedIds.size,
    visibleLessonCount,
    lessonCountLabel: formatCatalogLessons(visibleLessonCount),
    durationLabel: `${program.totalDays} dni`,
    difficulty: detail?.difficulty ?? "Vseh stopenj",
    categoryLabel: detail?.categoryLabel ?? program.label,
    benefits: detail?.benefits ?? [],
    highlights: getOwnedProgramHighlights(program),
    materials,
    sectionProgress: getSectionProgress(program, completedIds),
  };
}

export type OwnedOverviewModel = NonNullable<
  ReturnType<typeof getOwnedOverviewModel>
>;
