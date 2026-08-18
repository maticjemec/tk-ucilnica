import type { ProgramVisualId } from "@/types/dashboard";

export type CatalogFilterId =
  | "all"
  | "anxiety"
  | "confidence"
  | "growth"
  | "self-hypnosis"
  | "sleep-relaxation";

export type CatalogSortId =
  | "popularity"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export type CatalogView = "grid" | "list";

export type ProgramCategory =
  | "anxiety"
  | "confidence"
  | "growth"
  | "self-hypnosis"
  | "sleep"
  | "relaxation"
  | "journal";

export type CatalogProgram = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProgramCategory;
  categoryLabel: string;
  lessons: number;
  duration: string;
  price: number;
  popularity: number;
  isFavorite: boolean;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt?: string;
};
