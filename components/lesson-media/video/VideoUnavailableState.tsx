"use client";

import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import type { LessonVideoUnavailableReason } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

const MESSAGE: Record<LessonVideoUnavailableReason, string> = {
  preparing: "Video se pripravlja. Osveži stran čez nekaj trenutkov.",
  errored: "Video trenutno ni na voljo.",
  unavailable: "Video trenutno ni na voljo.",
};

type VideoUnavailableStateProps = {
  reason: LessonVideoUnavailableReason;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

export function VideoUnavailableState({
  reason,
  visual,
  imageSrc,
  imageAlt,
}: VideoUnavailableStateProps) {
  return (
    <>
      <CoverMedia
        alt={imageAlt}
        imageSrc={imageSrc}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="absolute inset-0 h-full w-full"
      >
        <ProgramPlaceholder visual={visual} variant="hero" />
      </CoverMedia>
      <div className="absolute inset-0 z-[1] flex items-end bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 py-5 sm:px-6 sm:py-6">
        <p className="max-w-[36rem] text-sm leading-relaxed text-white" role="status">
          {MESSAGE[reason]}
        </p>
      </div>
    </>
  );
}
