import type { ProgramVisualId } from "@/types/dashboard";

export type ProgramUnlockMode = "all" | "sequential" | "drip";

export type LessonAccessState =
  | "completed"
  | "current"
  | "available"
  | "locked";

export type LessonMediaKind = "video" | "audio";

export type LessonMediaProvider = "mock" | "mux" | "vimeo" | "youtube";

export type LessonMedia = {
  kind: LessonMediaKind;
  durationSeconds: number;
  /** Future hosted source. Absent in the mock player. */
  src?: string;
  provider?: LessonMediaProvider;
};

export type LessonResourceKind = "pdf" | "audio" | "worksheet";

export type LessonResource = {
  id: string;
  title: string;
  kind: LessonResourceKind;
  formatLabel: string;
  sizeLabel: string;
  /** Future downloadable file URL. */
  href?: string;
};

export type OwnedProgramMaterial = LessonResource & {
  subtitle: string;
  downloadLabel: string;
};

export type OwnedProgramHighlight = {
  id: string;
  icon: "calendar" | "play" | "file" | "infinity";
  title: string;
  description: string;
};

/**
 * Prepared for drip unlock. TASK 007 does not compute calendar dates.
 */
export type LessonDrip = {
  dayOffset?: number;
  unlockAt?: string;
};

export type ProgramLesson = {
  id: string;
  slug: string;
  /** Display day; seeded as lesson_order. */
  day: number;
  /** Canonical order from public.lessons.lesson_order. */
  order: number;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  media: LessonMedia;
  resources: LessonResource[];
  unlockMode?: ProgramUnlockMode;
  drip?: LessonDrip;
};

export type ProgramSection = {
  id: string;
  order: number;
  title: string;
  lessonIds: string[];
};

/**
 * @deprecated Use UserLessonProgressRow from lib/progress/types.
 * Left as a local view-model shape; not an authoritative data source.
 */
export type LessonProgress = {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
};

export type OwnedProgram = {
  id: string;
  slug: string;
  title: string;
  label: string;
  description: string;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt?: string;
  totalDays: number;
  /** Display label when the program is not a fixed day-count, e.g. lifetime access. */
  durationLabel?: string;
  unlockMode: ProgramUnlockMode;
  /**
   * @deprecated Unused at runtime. Progress comes from public.user_lesson_progress.
   */
  progress?: number;
  /**
   * @deprecated Unused at runtime. Continue lesson is computed from DB curriculum + progress.
   */
  currentLessonSlug?: string;
  /**
   * @deprecated Unused at runtime. Never copied into the database.
   */
  initialCompletedLessonIds?: string[];
  sections: ProgramSection[];
  lessons: ProgramLesson[];
  /** Program-level files. Future URLs live on each material's href. */
  materials: OwnedProgramMaterial[];
};

export type ResolvedLesson = ProgramLesson & {
  accessState: LessonAccessState;
  completed: boolean;
  locked: boolean;
  href: string;
};
