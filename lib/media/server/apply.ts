import "server-only";

import type { ProgramLesson } from "@/types/owned-program";

type SignedLessonMedia = {
  audioUrl: string | null;
  worksheetUrl: string | null;
};

/**
 * Overlay short-lived signed URLs onto the browser-facing lesson.
 * Storage object paths are never copied onto the returned object.
 */
export function applySignedLessonMedia(
  lesson: ProgramLesson,
  signed: SignedLessonMedia,
): ProgramLesson {
  const audioSrc = signed.audioUrl ?? lesson.audioSrc;
  const worksheetSrc = signed.worksheetUrl ?? lesson.worksheetSrc;
  let resources = lesson.resources;

  if (signed.worksheetUrl) {
    const existingIndex = resources.findIndex(
      (item) => item.kind === "worksheet" || item.kind === "pdf",
    );

    if (existingIndex >= 0) {
      resources = resources.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              href: undefined,
              signedDownloadUrl: signed.worksheetUrl ?? undefined,
            }
          : item,
      );
    } else {
      resources = [
        {
          id: `${lesson.id}-worksheet`,
          title: `Delovni list – ${lesson.title}`,
          kind: "worksheet" as const,
          formatLabel: "PDF",
          sizeLabel: "—",
          signedDownloadUrl: signed.worksheetUrl,
        },
        ...resources,
      ];
    }
  }

  return {
    ...lesson,
    audioSrc,
    worksheetSrc,
    media: {
      ...lesson.media,
      ...(lesson.media.kind === "audio" && audioSrc
        ? { src: audioSrc, provider: "hosted" as const }
        : {}),
    },
    resources,
  };
}
