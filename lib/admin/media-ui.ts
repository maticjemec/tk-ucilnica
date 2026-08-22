import type { ProgramContentType } from "@/lib/content/db-types";

export type AdminMediaRole = "primary" | "optional" | "orphaned";

export type AdminLessonMediaFlags = {
  video_provider: string | null;
  video_playback_id: string | null;
  video_asset_id: string | null;
  video_status: string | null;
  audio_path: string | null;
  worksheet_path: string | null;
};

export function hasAttachedVideo(lesson: AdminLessonMediaFlags) {
  return Boolean(
    lesson.video_provider ||
      lesson.video_playback_id ||
      lesson.video_asset_id ||
      lesson.video_status,
  );
}

export function hasAttachedAudio(lesson: AdminLessonMediaFlags) {
  return Boolean(lesson.audio_path);
}

export function hasAttachedWorksheet(lesson: AdminLessonMediaFlags) {
  return Boolean(lesson.worksheet_path);
}

/**
 * Aligns admin uploaders with resolveLessonMedia / LessonMedia.
 *
 * video: video player + optional PDF materials. Audio is not rendered.
 * audio: audio player + optional PDF materials. Video is not rendered.
 * text: description + optional PDF materials.
 * worksheet: PDF primary.
 * mixed: video + audio + PDF when present.
 */
export function lessonMediaRoles(
  contentType: ProgramContentType,
  lesson: AdminLessonMediaFlags,
): {
  video: AdminMediaRole | null;
  audio: AdminMediaRole | null;
  worksheet: AdminMediaRole | null;
} {
  const intended = {
    video: {
      video: "primary" as const,
      audio: null,
      worksheet: "optional" as const,
    },
    audio: {
      video: null,
      audio: "primary" as const,
      worksheet: "optional" as const,
    },
    text: {
      video: null,
      audio: null,
      worksheet: "optional" as const,
    },
    worksheet: {
      video: null,
      audio: null,
      worksheet: "primary" as const,
    },
    mixed: {
      video: "primary" as const,
      audio: "primary" as const,
      worksheet: "primary" as const,
    },
  }[contentType];

  return {
    video: intended.video ?? (hasAttachedVideo(lesson) ? "orphaned" : null),
    audio: intended.audio ?? (hasAttachedAudio(lesson) ? "orphaned" : null),
    worksheet:
      intended.worksheet ?? (hasAttachedWorksheet(lesson) ? "orphaned" : null),
  };
}

export function mediaRoleLabel(role: AdminMediaRole) {
  if (role === "primary") {
    return "Primarna vsebina";
  }

  if (role === "optional") {
    return "Dodatno gradivo (neobvezno)";
  }

  return "Še vedno pripeto";
}
