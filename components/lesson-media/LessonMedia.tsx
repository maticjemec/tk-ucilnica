"use client";

import { LessonAudioPlayer } from "@/components/lesson-media/LessonAudioPlayer";
import { LessonMixedContent } from "@/components/lesson-media/LessonMixedContent";
import { LessonTextContent } from "@/components/lesson-media/LessonTextContent";
import { LessonVideoPlayer } from "@/components/lesson-media/LessonVideoPlayer";
import { LessonWorksheet } from "@/components/lesson-media/LessonWorksheet";
import { resolveLessonMedia } from "@/lib/media/resolveLessonMedia";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type { ProgramVisualId } from "@/types/dashboard";
import type { ProgramLesson } from "@/types/owned-program";

type LessonMediaProps = {
  lesson: ProgramLesson;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

export function LessonMedia({
  lesson,
  visual,
  imageSrc,
  imageAlt,
}: LessonMediaProps) {
  const resolved = resolveLessonMedia(lesson);
  const heading = formatLessonHeading(lesson);

  switch (resolved.contentType) {
    case "audio":
      return resolved.audio ? (
        <LessonAudioPlayer
          title={lesson.duration}
          heading={heading}
          source={resolved.audio}
          durationSeconds={resolved.durationSeconds}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
          variant="featured"
        />
      ) : null;
    case "text":
      return (
        <LessonTextContent
          heading={heading}
          body={resolved.text || "Vsebina te lekcije bo kmalu na voljo."}
        />
      );
    case "worksheet":
      return resolved.worksheet ? (
        <LessonWorksheet
          worksheet={resolved.worksheet}
          description={lesson.description}
        />
      ) : null;
    case "mixed":
      return (
        <LessonMixedContent
          heading={heading}
          resolved={resolved}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
        />
      );
    case "video":
    default:
      return resolved.video ? (
        <LessonVideoPlayer
          title={heading}
          source={resolved.video}
          durationSeconds={resolved.durationSeconds}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
        />
      ) : null;
  }
}
