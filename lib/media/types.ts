/**
 * Provider-neutral lesson media types.
 *
 * DB fields stay video_url / audio_url / worksheet_url.
 * UI reads this resolved shape — never those column names.
 *
 * Video `src` may later be an HLS URL, signed URL, or playback ID
 * companion. Audio `src` may later be a Supabase Storage signed URL.
 * Worksheet `signedDownloadUrl` is the only download slot; do not treat
 * it as a permanent private file URL.
 */

export type LessonContentType =
  | "video"
  | "audio"
  | "text"
  | "worksheet"
  | "mixed";

export type LessonVideoProvider = "mock" | "hosted" | "hls";

export type LessonAudioProvider = "mock" | "hosted";

export type LessonVideoSource = {
  provider: LessonVideoProvider;
  src?: string;
  playbackId?: string;
};

export type LessonAudioSource = {
  provider: LessonAudioProvider;
  src?: string;
};

export type LessonWorksheetSource = {
  id: string;
  title: string;
  formatLabel: string;
  sizeLabel: string;
  signedDownloadUrl?: string;
};

export type LessonDetailsSlots = {
  showHeading: boolean;
  showDescription: boolean;
  showMaterials: boolean;
};

export type ResolvedLessonMedia = {
  contentType: LessonContentType;
  hasVideo: boolean;
  hasAudio: boolean;
  hasWorksheet: boolean;
  hasText: boolean;
  primaryMediaType: LessonContentType;
  video: LessonVideoSource | null;
  audio: LessonAudioSource | null;
  worksheet: LessonWorksheetSource | null;
  text: string | null;
  durationSeconds: number;
  details: LessonDetailsSlots;
};
