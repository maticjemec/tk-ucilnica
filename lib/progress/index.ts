export type { UserLessonProgressRow, ProgressWriteResult } from "@/lib/progress/types";

export {
  PROGRESS_SAVE_ERROR,
  buildOwnedProgressBySlug,
  buildProgramProgressView,
  getAverageOwnedProgressPercent,
  getCompletedLessonSlugs,
  getContinueLesson,
  getFallbackContinueHref,
  getOwnedProgramStatusLabel,
  getProgramProgressPercent,
  toCompletedLessonIds,
  type ProgramProgressView,
} from "@/lib/progress/helpers";
