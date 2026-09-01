export type { UserLessonProgressRow, ProgressWriteResult } from "@/lib/progress/types";

export {
  PROGRESS_SAVE_ERROR,
  buildOwnedProgressBySlug,
  buildProgramProgressView,
  getAverageOwnedProgressPercent,
  getCompletedLessonSlugs,
  getContinueLesson,
  getFallbackContinueHref,
  getOwnedEntryCtaLabel,
  getOwnedEntryHref,
  isFirstTimeProgramUser,
  getNextIncompleteLesson,
  getOwnedProgramStatusLabel,
  getProgramProgressPercent,
  toCompletedLessonIds,
  type ProgramProgressView,
} from "@/lib/progress/helpers";
