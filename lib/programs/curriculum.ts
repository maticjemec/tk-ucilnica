import type {
  LessonRow,
  LessonVideoProviderDb,
  LessonVideoStatusDb,
  ProgramContentType,
  ProgramSectionRow,
  ProgramUnlockModeDb,
} from "@/lib/content/db-types";
import type { Program } from "@/lib/programs/types";
import type {
  LessonMediaKind,
  OwnedProgram,
  ProgramLesson,
  ProgramSection,
  ProgramUnlockMode,
} from "@/types/owned-program";

const CONTENT_TYPES: readonly ProgramContentType[] = [
  "video",
  "audio",
  "text",
  "worksheet",
  "mixed",
];

const UNLOCK_MODES: readonly ProgramUnlockModeDb[] = [
  "all",
  "sequential",
  "drip",
];

const VIDEO_PROVIDERS: readonly LessonVideoProviderDb[] = ["mux"];

const VIDEO_STATUSES: readonly LessonVideoStatusDb[] = [
  "preparing",
  "ready",
  "errored",
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

function parseContentType(value: unknown): ProgramContentType | null {
  return typeof value === "string" &&
    CONTENT_TYPES.includes(value as ProgramContentType)
    ? (value as ProgramContentType)
    : null;
}

function parseUnlockMode(
  value: unknown,
): ProgramUnlockModeDb | null | undefined {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return UNLOCK_MODES.includes(value as ProgramUnlockModeDb)
    ? (value as ProgramUnlockModeDb)
    : undefined;
}

function parseVideoProvider(
  value: unknown,
): LessonVideoProviderDb | null | undefined {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return VIDEO_PROVIDERS.includes(value as LessonVideoProviderDb)
    ? (value as LessonVideoProviderDb)
    : undefined;
}

function parseVideoStatus(
  value: unknown,
): LessonVideoStatusDb | null | undefined {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  return VIDEO_STATUSES.includes(value as LessonVideoStatusDb)
    ? (value as LessonVideoStatusDb)
    : undefined;
}

/**
 * Legacy *_url fallback only. Storage paths and Mux IDs are not URLs.
 */
function legacyPublicUrl(value: string | null): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  return undefined;
}

export function parseProgramSectionRow(
  value: unknown,
): ProgramSectionRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const programId = readRequiredString(value.program_id);
  const title = readRequiredString(value.title);
  const createdAt = readRequiredString(value.created_at);
  const updatedAt = readRequiredString(value.updated_at);
  const sectionOrder = readFiniteNumber(value.section_order);
  const description = readOptionalString(value.description);

  if (
    !id ||
    !programId ||
    !title ||
    !createdAt ||
    !updatedAt ||
    sectionOrder == null ||
    description === undefined
  ) {
    return null;
  }

  return {
    id,
    program_id: programId,
    title,
    description,
    section_order: sectionOrder,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

export function parseLessonRow(value: unknown): LessonRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const programId = readRequiredString(value.program_id);
  const slug = readRequiredString(value.slug);
  const title = readRequiredString(value.title);
  const createdAt = readRequiredString(value.created_at);
  const updatedAt = readRequiredString(value.updated_at);
  const lessonOrder = readFiniteNumber(value.lesson_order);
  const contentType = parseContentType(value.content_type);
  const sectionId = readOptionalString(value.section_id);
  const description = readOptionalString(value.description);
  const videoUrl = readOptionalString(value.video_url);
  const audioUrl = readOptionalString(value.audio_url);
  const worksheetUrl = readOptionalString(value.worksheet_url);
  const videoPlaybackId = readOptionalString(value.video_playback_id);
  const videoAssetId = readOptionalString(value.video_asset_id);
  const audioPath = readOptionalString(value.audio_path);
  const worksheetPath = readOptionalString(value.worksheet_path);
  const unlockAt = readOptionalString(value.unlock_at);
  const durationMinutes =
    value.duration_minutes == null
      ? null
      : readFiniteNumber(value.duration_minutes);
  const dayOffset =
    value.day_offset == null ? null : readFiniteNumber(value.day_offset);

  if (value.unlock_mode != null && typeof value.unlock_mode !== "string") {
    return null;
  }

  const unlockMode = parseUnlockMode(value.unlock_mode);
  const videoProvider = parseVideoProvider(value.video_provider);
  const videoStatus = parseVideoStatus(value.video_status);

  if (
    unlockMode === undefined ||
    videoProvider === undefined ||
    videoStatus === undefined
  ) {
    return null;
  }

  if (
    !id ||
    !programId ||
    !slug ||
    !title ||
    !createdAt ||
    !updatedAt ||
    lessonOrder == null ||
    !contentType ||
    sectionId === undefined ||
    description === undefined ||
    videoUrl === undefined ||
    audioUrl === undefined ||
    worksheetUrl === undefined ||
    videoPlaybackId === undefined ||
    videoAssetId === undefined ||
    audioPath === undefined ||
    worksheetPath === undefined ||
    unlockAt === undefined ||
    durationMinutes === undefined ||
    dayOffset === undefined ||
    typeof value.is_preview !== "boolean" ||
    typeof value.is_published !== "boolean"
  ) {
    return null;
  }

  return {
    id,
    program_id: programId,
    section_id: sectionId,
    slug,
    title,
    description,
    lesson_order: lessonOrder,
    duration_minutes: durationMinutes,
    content_type: contentType,
    video_url: videoUrl,
    audio_url: audioUrl,
    worksheet_url: worksheetUrl,
    video_provider: videoProvider,
    video_playback_id: videoPlaybackId,
    video_asset_id: videoAssetId,
    video_status: videoStatus,
    audio_path: audioPath,
    worksheet_path: worksheetPath,
    is_preview: value.is_preview,
    is_published: value.is_published,
    unlock_mode: unlockMode,
    unlock_at: unlockAt,
    day_offset: dayOffset,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

function lessonDuration(minutes: number | null) {
  const safeMinutes = minutes && minutes > 0 ? minutes : 13;
  return {
    duration: `${safeMinutes} min`,
    durationSeconds: safeMinutes * 60,
  };
}

function mediaKind(contentType: ProgramContentType): LessonMediaKind {
  return contentType === "audio" ? "audio" : "video";
}

/**
 * Effective lesson mode is lesson.unlock_mode, else the program default.
 * Drip dates are evaluated in lib/owned-program/access.ts.
 */
export function resolveLessonUnlockMode(
  lessonMode: ProgramUnlockMode | undefined,
  programMode: ProgramUnlockMode,
): ProgramUnlockMode {
  return lessonMode ?? programMode;
}

function toProgramLesson(programSlug: string, row: LessonRow): ProgramLesson {
  const timing = lessonDuration(row.duration_minutes);
  // Identity/path columns stay on LessonRow. Only http(s) legacy *_url
  // values reach the browser-facing ProgramLesson src slots.
  const videoSrc = legacyPublicUrl(row.video_url);
  const audioSrc = legacyPublicUrl(row.audio_url);
  const worksheetSrc = legacyPublicUrl(row.worksheet_url);
  const src = videoSrc || audioSrc;
  const unlockMode = row.unlock_mode ?? undefined;
  const resources = worksheetSrc
    ? [
        {
          id: `${row.id}-worksheet`,
          title: `Delovni list – ${row.title}`,
          kind: "worksheet" as const,
          formatLabel: "PDF",
          sizeLabel: "—",
          signedDownloadUrl: worksheetSrc,
        },
      ]
    : [];

  return {
    id: row.id,
    slug: row.slug,
    day: row.lesson_order,
    order: row.lesson_order,
    title: row.title,
    description: row.description?.trim() || "",
    duration: timing.duration,
    durationSeconds: timing.durationSeconds,
    contentType: row.content_type,
    videoSrc,
    audioSrc,
    worksheetSrc,
    media: {
      kind: mediaKind(row.content_type),
      durationSeconds: timing.durationSeconds,
      src,
      provider: src ? "hosted" : "mock",
    },
    resources,
    unlockMode,
    drip:
      row.unlock_at || row.day_offset != null
        ? {
            unlockAt: row.unlock_at ?? undefined,
            dayOffset: row.day_offset ?? undefined,
          }
        : undefined,
  };
}

/**
 * Program-level default. A single drip lesson must not flip the rest of
 * the curriculum into drip (those rows would fail closed without dates).
 * Use drip/all as the program default only when every published lesson
 * explicitly shares that same mode.
 */
function deriveProgramUnlockMode(
  lessons: ProgramLesson[],
): ProgramUnlockMode {
  if (lessons.length === 0) {
    return "sequential";
  }

  const first = lessons[0]?.unlockMode;

  if (!first) {
    return "sequential";
  }

  return lessons.every((lesson) => lesson.unlockMode === first)
    ? first
    : "sequential";
}

export function assembleOwnedProgram(
  identity: Program,
  sectionRows: readonly ProgramSectionRow[],
  lessonRows: readonly LessonRow[],
): OwnedProgram {
  const published = [...lessonRows]
    .filter((row) => row.is_published)
    .sort((a, b) => a.lesson_order - b.lesson_order);

  const mapped = published.map((row) => ({
    sectionId: row.section_id,
    lesson: toProgramLesson(identity.slug, row),
  }));
  const lessons = mapped.map((item) => item.lesson);
  const knownSectionIds = new Set(sectionRows.map((section) => section.id));

  const sections: ProgramSection[] = [...sectionRows]
    .sort((a, b) => a.section_order - b.section_order)
    .map((section) => ({
      id: section.id,
      order: section.section_order,
      title: section.title,
      lessonIds: mapped
        .filter((item) => item.sectionId === section.id)
        .map((item) => item.lesson.id),
    }))
    .filter((section) => section.lessonIds.length > 0);

  const unsectionedIds = mapped
    .filter(
      (item) => !item.sectionId || !knownSectionIds.has(item.sectionId),
    )
    .map((item) => item.lesson.id);

  if (unsectionedIds.length > 0) {
    sections.push({
      id: `${identity.slug}-ostalo`,
      order: sections.length + 1,
      title: "Ostalo",
      lessonIds: unsectionedIds,
    });
  }

  return {
    id: identity.slug,
    slug: identity.slug,
    title: identity.title,
    label: identity.subtitle,
    description: identity.shortDescription,
    visual: identity.visual,
    imageSrc: identity.coverImageUrl,
    imageAlt: identity.imageAlt,
    totalDays: lessons.length || identity.lessonCount,
    durationLabel: identity.duration,
    unlockMode: deriveProgramUnlockMode(lessons),
    sections,
    lessons,
    materials: [],
  };
}

export function findOwnedLesson(program: OwnedProgram, lessonSlug: string) {
  return program.lessons.find((lesson) => lesson.slug === lessonSlug);
}

export type ProgramWithCurriculum = {
  identity: Program;
  program: OwnedProgram;
};
