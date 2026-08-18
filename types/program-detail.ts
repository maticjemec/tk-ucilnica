import type { CatalogProgram } from "@/types/catalog";

export type ProgramAccessState = "public" | "owned";

export type ProgramDetailIcon =
  | "bell"
  | "calendar"
  | "clock"
  | "file"
  | "infinity"
  | "lock"
  | "loop"
  | "monitor"
  | "play"
  | "refresh";

export type ProgramCurriculumItem = {
  id: string;
  order: number;
  title: string;
  duration: string;
  isPreview?: boolean;
};

export type ProgramDetailListItem = {
  id: string;
  label: string;
  icon: ProgramDetailIcon;
};

export type ProgramAuthor = {
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export type ProgramDetail = CatalogProgram & {
  shortDescription: string;
  longDescription: string;
  difficulty: string;
  breadcrumbLabel: string;
  benefits: string[];
  curriculum: ProgramCurriculumItem[];
  includes: ProgramDetailListItem[];
  purchaseBenefits: ProgramDetailListItem[];
  author: ProgramAuthor;
  accessState: ProgramAccessState;
};
