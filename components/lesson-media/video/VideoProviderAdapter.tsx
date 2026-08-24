"use client";

import type { RefObject } from "react";
import dynamic from "next/dynamic";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { VideoUnavailableState } from "@/components/lesson-media/video/VideoUnavailableState";
import type { LessonVideoSource } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

const MuxVideoSurface = dynamic(
  () =>
    import("@/components/lesson-media/video/MuxVideoSurface").then(
      (mod) => mod.MuxVideoSurface,
    ),
  { ssr: false },
);

type VideoProviderAdapterProps = {
  source: LessonVideoSource;
  title: string;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
  videoRef: RefObject<HTMLVideoElement | null>;
};

/**
 * Provider-neutral video surface.
 *
 * mux → MuxVideoSurface (signed HLS) or a safe unavailable state.
 * hosted / hls → HTML5 <video>.
 * mock → existing cover placeholder.
 */
export function VideoProviderAdapter({
  source,
  title,
  visual,
  imageSrc,
  imageAlt,
  videoRef,
}: VideoProviderAdapterProps) {
  if (source.provider === "mux") {
    if (
      source.unavailableReason ||
      !source.playbackId ||
      !source.playbackToken
    ) {
      return (
        <VideoUnavailableState
          reason={source.unavailableReason ?? "unavailable"}
          visual={visual}
          imageSrc={imageSrc}
          imageAlt={imageAlt}
        />
      );
    }

    return <MuxVideoSurface source={source} title={title} />;
  }

  if (source.provider === "mock" || !source.src) {
    return (
      <CoverMedia
        alt={imageAlt}
        imageSrc={imageSrc}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="absolute inset-0 h-full w-full"
      >
        <ProgramPlaceholder visual={visual} variant="hero" />
      </CoverMedia>
    );
  }

  return (
    <Html5VideoSurface
      src={source.src}
      title={title}
      poster={imageSrc}
      videoRef={videoRef}
    />
  );
}

function Html5VideoSurface({
  src,
  title,
  poster,
  videoRef,
}: {
  src: string;
  title: string;
  poster?: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
      aria-label={title}
    />
  );
}
