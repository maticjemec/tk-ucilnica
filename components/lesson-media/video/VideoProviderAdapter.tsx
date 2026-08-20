"use client";

import type { RefObject } from "react";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import type { LessonVideoSource } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

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
 * hosted / hls → HTML5 <video> (HLS adapter can replace Html5VideoSurface later).
 * mock → existing cover placeholder. No Mux/Cloudflare SDKs.
 */
export function VideoProviderAdapter({
  source,
  title,
  visual,
  imageSrc,
  imageAlt,
  videoRef,
}: VideoProviderAdapterProps) {
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
