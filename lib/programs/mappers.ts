import { formatCatalogLessons } from "@/lib/content/catalog";
import {
  getFallbackContinueHref,
  getOwnedEntryCtaLabel,
  getOwnedEntryHref,
} from "@/lib/progress/helpers";
import type { ProgramProgressView } from "@/lib/progress/helpers";
import type { ProgramRow } from "@/lib/content/db-types";
import { getProgramVisual } from "@/lib/programs/visuals";
import type { Program } from "@/lib/programs/types";
import type { CatalogProgram, ProgramCategory } from "@/types/catalog";
import type { DashboardProgram } from "@/types/dashboard";
import type { OwnedProgram } from "@/types/owned-program";
import type { PurchasedProgram } from "@/types/programs";

const PROGRAM_CATEGORIES: readonly ProgramCategory[] = [
  "anxiety",
  "confidence",
  "growth",
  "self-hypnosis",
  "sleep",
  "relaxation",
  "journal",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRequiredString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readOptionalString(value: unknown) {
  if (value == null) {
    return null;
  }

  return typeof value === "string" ? value : undefined;
}

function readFiniteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseCategory(value: string): ProgramCategory | null {
  return PROGRAM_CATEGORIES.includes(value as ProgramCategory)
    ? (value as ProgramCategory)
    : null;
}

/**
 * Runtime parse of a public.programs row.
 * Invalid rows are dropped rather than leaking partial DB shapes.
 */
export function parseProgramRow(value: unknown): ProgramRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const slug = readRequiredString(value.slug);
  const title = readRequiredString(value.title);
  const category = readRequiredString(value.category);
  const categoryLabel = readRequiredString(value.category_label);
  const currency = readRequiredString(value.currency);
  const createdAt = readRequiredString(value.created_at);
  const updatedAt = readRequiredString(value.updated_at);
  const priceCents = readFiniteNumber(value.price_cents);
  const lessonCount = readFiniteNumber(value.lesson_count);
  const sortOrder = readFiniteNumber(value.sort_order);
  const subtitle = readOptionalString(value.subtitle);
  const shortDescription = readOptionalString(value.short_description);
  const longDescription = readOptionalString(value.long_description);
  const durationLabel = readOptionalString(value.duration_label);
  const difficulty = readOptionalString(value.difficulty);
  const coverImageUrl = readOptionalString(value.cover_image_url);

  if (
    !id ||
    !slug ||
    !title ||
    !category ||
    !categoryLabel ||
    !currency ||
    !createdAt ||
    !updatedAt ||
    priceCents == null ||
    lessonCount == null ||
    sortOrder == null ||
    typeof value.is_published !== "boolean" ||
    typeof value.is_featured !== "boolean" ||
    subtitle === undefined ||
    shortDescription === undefined ||
    longDescription === undefined ||
    durationLabel === undefined ||
    difficulty === undefined ||
    coverImageUrl === undefined
  ) {
    return null;
  }

  return {
    id,
    slug,
    title,
    subtitle,
    short_description: shortDescription,
    long_description: longDescription,
    category,
    category_label: categoryLabel,
    price_cents: priceCents,
    currency,
    duration_label: durationLabel,
    difficulty,
    lesson_count: lessonCount,
    is_published: value.is_published,
    is_featured: value.is_featured,
    sort_order: sortOrder,
    cover_image_url: coverImageUrl,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function centsToEur(priceCents: number) {
  return priceCents / 100;
}

function catalogPopularity(program: Program) {
  const rank = Math.max(0, 10_000 - program.sortOrder);
  return program.isFeatured ? rank + 10_000 : rank;
}

export function toProgram(row: ProgramRow): Program | null {
  const category = parseCategory(row.category);

  if (!category) {
    return null;
  }

  const visual = getProgramVisual(row.slug, row.title);
  const coverImageUrl = row.cover_image_url?.trim() || undefined;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle?.trim() || row.title,
    shortDescription: row.short_description?.trim() || "",
    longDescription: row.long_description?.trim() || "",
    category,
    categoryLabel: row.category_label,
    price: centsToEur(row.price_cents),
    duration: row.duration_label?.trim() || "",
    difficulty: row.difficulty?.trim() || "Vseh stopenj",
    lessonCount: row.lesson_count,
    isFeatured: row.is_featured,
    sortOrder: row.sort_order,
    coverImageUrl,
    visual: visual.visual,
    imageAlt: visual.imageAlt,
  };
}

export function toCatalogProgram(program: Program): CatalogProgram {
  return {
    id: program.slug,
    slug: program.slug,
    title: program.title,
    description: program.shortDescription,
    category: program.category,
    categoryLabel: program.categoryLabel,
    lessons: program.lessonCount,
    duration: program.duration,
    price: program.price,
    popularity: catalogPopularity(program),
    isFavorite: false,
    visual: program.visual,
    imageSrc: program.coverImageUrl,
    imageAlt: program.imageAlt,
  };
}

export function toDashboardProgram(
  program: Program,
  progress = 0,
): DashboardProgram {
  return {
    slug: program.slug,
    title: program.title,
    label: program.subtitle,
    description: program.shortDescription,
    progress,
    visual: program.visual,
    imageSrc: program.coverImageUrl,
    imageAlt: program.imageAlt,
  };
}

export function toPurchasedProgram(
  program: Program,
  progress?: ProgramProgressView,
): PurchasedProgram {
  const progressPercent = progress?.progressPercent ?? 0;
  const isCompleted = progress?.isCompleted ?? false;

  return {
    ...toDashboardProgram(program, progressPercent),
    status: isCompleted ? "completed" : "in-progress",
    lessons: formatCatalogLessons(program.lessonCount),
    duration: program.duration,
    continueHref: progress
      ? getOwnedEntryHref(program.slug, progress)
      : getFallbackContinueHref(program.slug),
    continueAvailable: progress?.continueAvailable ?? false,
    ctaLabel: progress
      ? getOwnedEntryCtaLabel(progress, "program")
      : "Začni program",
  };
}

/**
 * Overlay DB program identity onto an owned-program view-model.
 * Curriculum must already come from public.program_sections / public.lessons.
 */
export function applyProgramIdentity(
  program: OwnedProgram,
  identity: Program,
): OwnedProgram {
  return {
    ...program,
    title: identity.title,
    label: identity.subtitle,
    description: identity.shortDescription,
    visual: identity.visual,
    imageSrc: identity.coverImageUrl,
    imageAlt: identity.imageAlt,
    durationLabel: identity.duration,
  };
}
