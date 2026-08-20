/**
 * TASK 013A — Supabase row types for program content.
 *
 * These match public.programs / program_sections / lessons.
 * They are not used by pages yet. Runtime catalog, owned overview, and
 * lesson player still read local TypeScript in lib/content/.
 */

export type ProgramContentType =
  | "video"
  | "audio"
  | "text"
  | "worksheet"
  | "mixed";

export type ProgramUnlockModeDb = "all" | "sequential" | "drip";

/**
 * Canonical program identity. Must match user_programs.program_slug
 * and local catalog / owned-program slugs.
 */
export type ProgramSlug =
  | "21-dni-do-manj-anksioznosti"
  | "21-dni-do-boljse-samozavesti"
  | "najdi-sebe"
  | "samohipnoza-v-praksi"
  | "boljsi-spanec-boljse-jutri"
  | "umiri-telo-umiri-um"
  | "zasij-v-21-dneh"
  | "21-dni-hvaleznosti";

export type ProgramRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  short_description: string | null;
  long_description: string | null;
  category: string;
  category_label: string;
  price_cents: number;
  currency: string;
  duration_label: string | null;
  difficulty: string | null;
  lesson_count: number;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgramSectionRow = {
  id: string;
  program_id: string;
  title: string;
  description: string | null;
  section_order: number;
  created_at: string;
  updated_at: string;
};

export type LessonRow = {
  id: string;
  program_id: string;
  section_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  lesson_order: number;
  duration_minutes: number | null;
  content_type: ProgramContentType;
  video_url: string | null;
  audio_url: string | null;
  worksheet_url: string | null;
  is_preview: boolean;
  is_published: boolean;
  unlock_mode: ProgramUnlockModeDb | null;
  unlock_at: string | null;
  day_offset: number | null;
  created_at: string;
  updated_at: string;
};
