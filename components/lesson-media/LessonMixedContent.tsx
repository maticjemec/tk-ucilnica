"use client";

import { LessonAudioPlayer } from "@/components/lesson-media/LessonAudioPlayer";
import { LessonTextContent } from "@/components/lesson-media/LessonTextContent";
import { LessonVideoPlayer } from "@/components/lesson-media/LessonVideoPlayer";
import { LessonWorksheet } from "@/components/lesson-media/LessonWorksheet";
import type { ResolvedLessonMedia } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

type LessonMixedContentProps = {
  heading: string;
  resolved: ResolvedLessonMedia;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

export function LessonMixedContent({
  heading,
  resolved,
  visual,
  imageSrc,
  imageAlt,
}: LessonMixedContentProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {resolved.hasVideo && resolved.video ? (
        <LessonVideoPlayer
          title={heading}
          source={resolved.video}
          durationSeconds={resolved.durationSeconds}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
        />
      ) : null}

      {resolved.hasAudio && resolved.audio ? (
        <LessonAudioPlayer
          title={heading}
          heading={heading}
          source={resolved.audio}
          durationSeconds={resolved.durationSeconds}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          variant={resolved.hasVideo ? "inline" : "featured"}
          showHeading={!resolved.hasVideo}
        />
      ) : null}

      {resolved.hasText && resolved.text ? (
        <LessonTextContent heading={heading} body={resolved.text} compact />
      ) : null}

      {resolved.hasWorksheet && resolved.worksheet ? (
        <LessonWorksheet worksheet={resolved.worksheet} />
      ) : null}
    </div>
  );
}
