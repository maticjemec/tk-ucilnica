import type { LessonRow, ProgramRow, ProgramSectionRow } from "@/lib/content/db-types";

export type AdminProgramListItem = ProgramRow & {
  lessonTotal: number;
  lessonPublished: number;
};

export type AdminLessonListItem = LessonRow & {
  sectionTitle: string | null;
};

export type AdminProgramDetail = {
  program: ProgramRow;
  sections: ProgramSectionRow[];
  lessons: AdminLessonListItem[];
  lessonTotal: number;
  lessonPublished: number;
};

export type AdminHomeStats = {
  total: number;
  published: number;
  draft: number;
};

export type CreateProgramInput = {
  title: string;
  slug: string;
  subtitle: string | null;
  shortDescription: string | null;
  longDescription: string | null;
  category: string;
  priceEur: number | string;
  currency: string;
  durationLabel: string | null;
  difficulty: string | null;
  lessonCount: number | string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number | string;
  coverImageUrl: string | null;
};

export type UpdateProgramInput = Omit<CreateProgramInput, "slug"> & {
  slug: string;
};

export type CreateSectionInput = {
  programSlug: string;
  title: string;
  description: string | null;
  sectionOrder: number | string;
};

export type UpdateSectionInput = {
  programSlug: string;
  sectionId: string;
  title: string;
  description: string | null;
  sectionOrder: number | string;
};

export type CreateLessonInput = {
  programSlug: string;
  title: string;
  slug: string;
  description: string | null;
  sectionId: string | null;
  lessonOrder: number | string;
  durationMinutes: number | string | null;
  contentType: string;
  isPreview: boolean;
  isPublished: boolean;
  unlockMode: string | null;
  unlockAt: string | null;
  dayOffset: number | string | null;
};

export type UpdateLessonInput = Omit<CreateLessonInput, "slug"> & {
  slug: string;
};
