import type { ProgramCategory } from "@/types/catalog";
import type { ProgramContentType, ProgramUnlockModeDb } from "@/lib/content/db-types";

export const ADMIN_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ADMIN_CONTENT_TYPES: readonly ProgramContentType[] = [
  "video",
  "audio",
  "text",
  "worksheet",
  "mixed",
];

export const ADMIN_UNLOCK_MODES: readonly ProgramUnlockModeDb[] = [
  "all",
  "sequential",
  "drip",
];

export const ADMIN_CATEGORIES: readonly {
  value: ProgramCategory;
  label: string;
}[] = [
  { value: "anxiety", label: "Anksioznost" },
  { value: "confidence", label: "Samozavest" },
  { value: "growth", label: "Osebna rast" },
  { value: "self-hypnosis", label: "Samohipnoza" },
  { value: "sleep", label: "Spanec" },
  { value: "relaxation", label: "Sprostitev" },
  { value: "journal", label: "Dnevnik" },
];

export const CONTENT_TYPE_HINTS: Record<ProgramContentType, string> = {
  video: "Video je primarni medij. Zvok in PDF sta neobvezna.",
  audio: "Zvok je primarni medij.",
  text: "Prikazano je samo besedilo iz opisa lekcije.",
  worksheet: "Primarni je delovni list (PDF).",
  mixed: "Poljubna kombinacija videa, zvoka, besedila in PDF.",
};

export const AUDIO_EXTENSIONS = ["mp3", "m4a"] as const;
export const AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
] as const;

export const COVER_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const COVER_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_AUDIO_BYTES = 52_428_800;
export const MAX_WORKSHEET_BYTES = 20_971_520;
export const MAX_COVER_BYTES = 5_242_880;
