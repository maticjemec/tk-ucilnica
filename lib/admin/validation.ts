import {
  ADMIN_CATEGORIES,
  ADMIN_CONTENT_TYPES,
  ADMIN_SLUG,
  ADMIN_UNLOCK_MODES,
  AUDIO_EXTENSIONS,
  AUDIO_MIME_TYPES,
} from "@/lib/admin/constants";
import type { ProgramCategory } from "@/types/catalog";
import type {
  ProgramContentType,
  ProgramUnlockModeDb,
} from "@/lib/content/db-types";

export function slugifyTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[čć]/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseRequiredString(value: unknown, max = 200) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null;
}

export function parseOptionalString(value: unknown, max = 4000) {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.length <= max ? trimmed : undefined;
}

export function parseSlug(value: unknown) {
  const slug = parseRequiredString(value, 80);

  if (!slug || !ADMIN_SLUG.test(slug)) {
    return null;
  }

  return slug;
}

export function parseNonNegativeInt(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(number) || number < 0) {
    return null;
  }

  return number;
}

export function parsePositiveInt(value: unknown) {
  const number = parseNonNegativeInt(value);
  return number && number > 0 ? number : null;
}

export function parseOptionalPositiveInt(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  return parsePositiveInt(value);
}

export function parseOptionalNonNegativeInt(value: unknown) {
  if (value == null || value === "") {
    return null;
  }

  return parseNonNegativeInt(value);
}

export function parsePriceCents(value: unknown) {
  if (value == null || value === "") {
    return 0;
  }

  const number = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return null;
  }

  return Math.round(number * 100);
}

export function parseBoolean(value: unknown) {
  return value === true || value === "true" || value === "on" || value === "1";
}

export function parseCategory(value: unknown): ProgramCategory | null {
  return ADMIN_CATEGORIES.some((item) => item.value === value)
    ? (value as ProgramCategory)
    : null;
}

export function categoryLabel(category: ProgramCategory) {
  return (
    ADMIN_CATEGORIES.find((item) => item.value === category)?.label ?? category
  );
}

export function parseContentType(value: unknown): ProgramContentType | null {
  return ADMIN_CONTENT_TYPES.includes(value as ProgramContentType)
    ? (value as ProgramContentType)
    : null;
}

export function parseUnlockModeField(value: unknown) {
  if (value == null || value === "") {
    return { ok: true as const, value: null };
  }

  if (!ADMIN_UNLOCK_MODES.includes(value as ProgramUnlockModeDb)) {
    return { ok: false as const };
  }

  return { ok: true as const, value: value as ProgramUnlockModeDb };
}

export function parseIsoDateTime(value: unknown) {
  if (value == null || value === "") {
    return { ok: true as const, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false as const };
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return { ok: false as const };
  }

  return { ok: true as const, value: parsed.toISOString() };
}

export function parseHttpUrl(value: unknown) {
  const url = parseOptionalString(value, 2000);

  if (url === undefined) {
    return undefined;
  }

  if (url === null) {
    return null;
  }

  if (!/^https?:\/\//i.test(url)) {
    return undefined;
  }

  return url;
}

export function audioExtensionFromName(filename: string) {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = match?.[1];

  return ext && AUDIO_EXTENSIONS.includes(ext as (typeof AUDIO_EXTENSIONS)[number])
    ? ext
    : null;
}

export function isAllowedAudioMime(value: string) {
  return AUDIO_MIME_TYPES.includes(value as (typeof AUDIO_MIME_TYPES)[number]);
}

export function centsToEur(priceCents: number) {
  return (priceCents / 100).toFixed(2);
}
