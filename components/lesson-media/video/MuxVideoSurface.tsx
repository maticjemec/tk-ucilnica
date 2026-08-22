"use client";

import MuxPlayer from "@mux/mux-player-react";
import type { LessonVideoSource } from "@/lib/media/types";

type MuxVideoSurfaceProps = {
  source: LessonVideoSource;
  title: string;
};

export function MuxVideoSurface({ source, title }: MuxVideoSurfaceProps) {
  if (!source.playbackId || !source.playbackToken) {
    return null;
  }

  return (
    <MuxPlayer
      playbackId={source.playbackId}
      tokens={{
        playback: source.playbackToken,
        thumbnail: source.thumbnailToken,
        storyboard: source.storyboardToken,
      }}
      streamType="on-demand"
      accentColor="#a67c52"
      title={title}
      preload="metadata"
      playsInline
      proudlyDisplayMuxBadge={false}
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
