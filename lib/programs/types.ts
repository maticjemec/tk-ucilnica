import type { ProgramCategory } from "@/types/catalog";
import type { ProgramVisualId } from "@/types/dashboard";

export type { ProgramRow } from "@/lib/content/db-types";

/**
 * Mapped program identity for UI.
 * Pages and components consume this, not raw ProgramRow.
 */
export type Program = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  category: ProgramCategory;
  categoryLabel: string;
  price: number;
  duration: string;
  difficulty: string;
  lessonCount: number;
  isFeatured: boolean;
  sortOrder: number;
  coverImageUrl?: string;
  visual: ProgramVisualId;
  imageAlt: string;
};
