import "server-only";

import { cache } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  assembleOwnedProgram,
  parseLessonRow,
  parseProgramSectionRow,
  type ProgramWithCurriculum,
} from "@/lib/programs/curriculum";
import { parseProgramRow, toProgram } from "@/lib/programs/mappers";
import type { Program } from "@/lib/programs/types";
import { createClient } from "@/lib/supabase/server";

const PROGRAMS_TABLE = "programs";

const PROGRAM_COLUMNS =
  "id, slug, title, subtitle, short_description, long_description, category, category_label, price_cents, currency, duration_label, difficulty, lesson_count, is_published, is_featured, sort_order, cover_image_url, created_at, updated_at";

const PROGRAM_LIST_COLUMNS =
  "id, slug, title, subtitle, short_description, category, category_label, price_cents, currency, duration_label, difficulty, lesson_count, is_published, is_featured, sort_order, cover_image_url, created_at, updated_at";

const CURRICULUM_SELECT = `${PROGRAM_COLUMNS}, program_sections ( id, program_id, title, description, section_order, created_at, updated_at ), lessons ( id, program_id, section_id, slug, title, description, lesson_order, duration_minutes, content_type, video_url, audio_url, worksheet_url, video_provider, video_playback_id, video_asset_id, video_status, audio_path, worksheet_path, is_preview, is_published, unlock_mode, unlock_at, day_offset, created_at, updated_at )`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mapProgramRows(data: unknown): Program[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const programs: Program[] = [];

  for (const item of data) {
    const row = parseProgramRow(item);

    if (!row || !row.is_published) {
      continue;
    }

    const program = toProgram(row);

    if (program) {
      programs.push(program);
    }
  }

  return programs;
}

function mapCurriculumRow(value: unknown): ProgramWithCurriculum | null {
  const programRow = parseProgramRow(value);

  if (!programRow || !programRow.is_published) {
    return null;
  }

  const identity = toProgram(programRow);

  if (!identity || !isRecord(value)) {
    return null;
  }

  const sectionValues = Array.isArray(value.program_sections)
    ? value.program_sections
    : [];
  const lessonValues = Array.isArray(value.lessons) ? value.lessons : [];

  const sections = sectionValues
    .map(parseProgramSectionRow)
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
  const lessons = lessonValues
    .map(parseLessonRow)
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  return {
    identity,
    program: assembleOwnedProgram(identity, sections, lessons),
  };
}

function mapCurriculumRows(data: unknown): ProgramWithCurriculum[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const results: ProgramWithCurriculum[] = [];

  for (const item of data) {
    const mapped = mapCurriculumRow(item);

    if (mapped) {
      results.push(mapped);
    }
  }

  return results;
}

export type PublishedProgramsResult =
  | { ok: true; programs: Program[] }
  | { ok: false; programs: [] };

export type ProgramLookupResult =
  | { ok: true; program: Program | null }
  | { ok: false; program: null };

export type ProgramCurriculumResult =
  | { ok: true; bundle: ProgramWithCurriculum | null }
  | { ok: false; bundle: null };

export type ProgramCurriculaResult =
  | { ok: true; bundles: ProgramWithCurriculum[] }
  | { ok: false; bundles: [] };

async function fetchPublishedPrograms(
  supabase: SupabaseClient,
): Promise<PublishedProgramsResult> {
  const { data, error } = await supabase
    .from(PROGRAMS_TABLE)
    .select(PROGRAM_LIST_COLUMNS)
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[programs] Failed to load published programs.");
    return { ok: false, programs: [] };
  }

  return { ok: true, programs: mapProgramRows(data) };
}

const loadPublishedPrograms = cache(async (): Promise<PublishedProgramsResult> => {
  const supabase = await createClient();
  return fetchPublishedPrograms(supabase);
});

/**
 * Published catalog programs, ordered by sort_order.
 * Request-level cache via React cache().
 */
export async function getPublishedPrograms(): Promise<Program[]> {
  return (await loadPublishedPrograms()).programs;
}

export async function getPublishedProgramsResult(): Promise<PublishedProgramsResult> {
  return loadPublishedPrograms();
}

/**
 * Single published program by slug.
 * Unpublished or missing rows resolve to null (RLS + explicit filter).
 */
const loadProgramBySlug = cache(
  async (slug: string): Promise<ProgramLookupResult> => {
    if (!slug) {
      return { ok: true, program: null };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PROGRAMS_TABLE)
      .select(PROGRAM_COLUMNS)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[programs] Failed to load program.");
      return { ok: false, program: null };
    }

    const row = parseProgramRow(data);

    if (!row || !row.is_published) {
      return { ok: true, program: null };
    }

    return { ok: true, program: toProgram(row) };
  },
);

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  return (await loadProgramBySlug(slug)).program;
}

export async function getProgramBySlugResult(
  slug: string,
): Promise<ProgramLookupResult> {
  return loadProgramBySlug(slug);
}

/**
 * Published programs for the given slugs, one query.
 * Used by Moji programi / Pregled to avoid N+1 lookups.
 */
export const getProgramsBySlugs = cache(
  async (slugs: readonly string[]): Promise<Program[]> => {
    const unique = [...new Set(slugs.filter((slug) => slug.length > 0))];

    if (unique.length === 0) {
      return [];
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PROGRAMS_TABLE)
      .select(PROGRAM_LIST_COLUMNS)
      .in("slug", unique)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[programs] Failed to load programs.");
      return [];
    }

    return mapProgramRows(data);
  },
);

/**
 * Published program plus sections and lessons in one nested query.
 * Query failure and missing/unpublished programs resolve to null.
 */
const loadProgramWithCurriculum = cache(
  async (slug: string): Promise<ProgramCurriculumResult> => {
    if (!slug) {
      return { ok: true, bundle: null };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PROGRAMS_TABLE)
      .select(CURRICULUM_SELECT)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[programs] Failed to load program curriculum.");
      return { ok: false, bundle: null };
    }

    return { ok: true, bundle: mapCurriculumRow(data) };
  },
);

export async function getProgramWithCurriculum(
  slug: string,
): Promise<ProgramWithCurriculum | null> {
  return (await loadProgramWithCurriculum(slug)).bundle;
}

export async function getProgramWithCurriculumResult(
  slug: string,
): Promise<ProgramCurriculumResult> {
  return loadProgramWithCurriculum(slug);
}

/**
 * Batched curriculum for owned-program lists. One query for all slugs.
 */
const loadCurriculumForPrograms = cache(
  async (slugs: readonly string[]): Promise<ProgramCurriculaResult> => {
    const unique = [...new Set(slugs.filter((slug) => slug.length > 0))];

    if (unique.length === 0) {
      return { ok: true, bundles: [] };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from(PROGRAMS_TABLE)
      .select(CURRICULUM_SELECT)
      .in("slug", unique)
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[programs] Failed to load program curricula.");
      return { ok: false, bundles: [] };
    }

    return { ok: true, bundles: mapCurriculumRows(data) };
  },
);

export async function getCurriculumForPrograms(
  slugs: readonly string[],
): Promise<ProgramWithCurriculum[]> {
  return (await loadCurriculumForPrograms(slugs)).bundles;
}

export async function getCurriculumForProgramsResult(
  slugs: readonly string[],
): Promise<ProgramCurriculaResult> {
  return loadCurriculumForPrograms(slugs);
}
