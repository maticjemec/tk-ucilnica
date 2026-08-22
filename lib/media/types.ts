/**
 * Provider-neutral lesson media types.
 *
 * Canonical DB identity is video_provider / video_playback_id /
 * video_asset_id / audio_path / worksheet_path.
 * Legacy video_url / audio_url / worksheet_url are fallbacks only.
 * UI reads this resolved shape — never those column names.
 *
 * Video `src` is a resolved playable URL, never a Mux ID or storage path.
 * Audio `src` is a resolved signed URL, never audio_path.
 * Worksheet `signedDownloadUrl` is the only download slot; do not treat
 * it as a permanent private file URL.
 */

export type LessonContentType =
  | "video"
  | "audio"
  | "text"
  | "worksheet"
  | "mixed";

export type LessonVideoProvider = "mock" | "hosted" | "hls" | "mux";

export type LessonAudioProvider = "mock" | "hosted";

export type LessonVideoUnavailableReason =
  | "preparing"
  | "errored"
  | "unavailable";

export type LessonMuxPlayback = {
  state: "ready" | LessonVideoUnavailableReason;
  playbackId?: string;
  playbackToken?: string;
  thumbnailToken?: string;
  storyboardToken?: string;
};

export type LessonVideoSource = {
  provider: LessonVideoProvider;
  src?: string;
  playbackId?: string;
  playbackToken?: string;
  thumbnailToken?: string;
  storyboardToken?: string;
  unavailableReason?: LessonVideoUnavailableReason;
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
