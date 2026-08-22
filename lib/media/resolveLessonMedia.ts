import type { LessonContentType, ResolvedLessonMedia } from "@/lib/media/types";
import type { ProgramLesson } from "@/types/owned-program";

function inferContentType(lesson: ProgramLesson): LessonContentType {
  if (lesson.contentType) {
    return lesson.contentType;
  }

  return lesson.media.kind === "audio" ? "audio" : "video";
}

function inferVideoProvider(src?: string): "hosted" | "hls" {
  if (src && (src.includes(".m3u8") || src.includes("application/vnd.apple.hls"))) {
    return "hls";
  }

  return "hosted";
}

function videoSrcOf(lesson: ProgramLesson) {
  return lesson.videoSrc?.trim() || (
    lesson.media.kind === "video" ? lesson.media.src?.trim() : undefined
  );
}

function audioSrcOf(lesson: ProgramLesson) {
  return lesson.audioSrc?.trim() || (
    lesson.media.kind === "audio" ? lesson.media.src?.trim() : undefined
  );
}

function worksheetOf(lesson: ProgramLesson): ResolvedLessonMedia["worksheet"] {
  const fromUrl = lesson.worksheetSrc?.trim();
  const resource =
    lesson.resources.find((item) => item.kind === "worksheet" || item.kind === "pdf") ??
    lesson.resources[0];

  if (!fromUrl && !resource) {
    return {
      id: `${lesson.id}-worksheet`,
      title: `Delovni list – ${lesson.title}`,
      formatLabel: "PDF",
      sizeLabel: "—",
    };
  }

  return {
    id: resource?.id ?? `${lesson.id}-worksheet`,
    title: resource?.title ?? `Delovni list – ${lesson.title}`,
    formatLabel: resource?.formatLabel ?? "PDF",
    sizeLabel: resource?.sizeLabel ?? "—",
    signedDownloadUrl: fromUrl || resource?.signedDownloadUrl,
  };
}

/**
 * Single lesson-content resolver.
 *
 * Mixed lessons only surface blocks that actually exist (signed or
 * legacy URLs for video/audio/worksheet). Typed video/audio/worksheet
 * lessons still render their primary surface when the URL is null —
 * as a polished mock/placeholder, not an empty hole.
 */
export function resolveLessonMedia(lesson: ProgramLesson): ResolvedLessonMedia {
  const contentType = inferContentType(lesson);
  const videoSrc = videoSrcOf(lesson) || undefined;
  const audioSrc = audioSrcOf(lesson) || undefined;
  const text = lesson.description.trim() || null;
  const worksheetSrc = lesson.worksheetSrc?.trim() || undefined;

  const hasVideo =
    contentType === "video" || (contentType === "mixed" && Boolean(videoSrc));
  const hasAudio =
    contentType === "audio" || (contentType === "mixed" && Boolean(audioSrc));
  const hasText =
    contentType === "text" || (contentType === "mixed" && Boolean(text));
  const hasWorksheet =
    contentType === "worksheet" ||
    (contentType === "mixed" && Boolean(worksheetSrc));

  return {
    contentType,
    hasVideo,
    hasAudio,
    hasText,
    hasWorksheet,
    primaryMediaType: contentType,
    video: hasVideo
      ? {
          provider: videoSrc ? inferVideoProvider(videoSrc) : "mock",
          src: videoSrc,
          playbackId: lesson.media.playbackId,
        }
      : null,
    audio: hasAudio
      ? {
          provider: audioSrc ? "hosted" : "mock",
          src: audioSrc,
        }
      : null,
    worksheet: hasWorksheet ? worksheetOf(lesson) : null,
    text: hasText ? text : null,
    durationSeconds: lesson.durationSeconds,
    details: {
      showHeading:
        contentType === "video" ||
        (contentType === "mixed" && (hasVideo || !hasAudio)),
      showDescription: contentType === "video" || contentType === "audio",
      showMaterials:
        contentType === "video" ||
        contentType === "audio" ||
        (contentType === "text" && lesson.resources.length > 0),
    },
  };
}
