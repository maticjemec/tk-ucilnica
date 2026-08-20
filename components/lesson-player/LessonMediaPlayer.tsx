"use client";

import { LessonVideoPlayer } from "@/components/lesson-media/LessonVideoPlayer";
import type { ProgramVisualId } from "@/types/dashboard";
import type { LessonMedia } from "@/types/owned-program";

type LessonMediaPlayerProps = {
  title: string;
  media: LessonMedia;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

/** @deprecated Use LessonMedia / LessonVideoPlayer. Kept as a thin adapter. */
export function LessonMediaPlayer({
  title,
  media,
  visual,
  imageSrc,
  imageAlt,
}: LessonMediaPlayerProps) {
  return (
    <LessonVideoPlayer
      title={title}
      source={{
        provider: media.src ? media.provider ?? "hosted" : "mock",
        src: media.src,
        playbackId: media.playbackId,
      }}
      durationSeconds={media.durationSeconds}
      visual={visual}
      imageSrc={imageSrc}
      imageAlt={imageAlt}
    />
  );
}
