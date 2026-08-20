"use client";

import { useEffect, useRef, useState } from "react";
import {
  Captions,
  Maximize,
  Minimize,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  formatPlaybackClock,
  MediaIconButton,
  MediaSlider,
} from "@/components/lesson-media/controls";
import {
  useElementPlayback,
  useMockPlayback,
} from "@/components/lesson-media/use-playback";
import { VideoProviderAdapter } from "@/components/lesson-media/video/VideoProviderAdapter";
import { cn } from "@/lib/cn";
import { formatTimecode } from "@/lib/owned-program/access";
import type { LessonVideoSource } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

type LessonVideoPlayerProps = {
  title: string;
  source: LessonVideoSource;
  durationSeconds: number;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return reduced;
}

export function LessonVideoPlayer({
  title,
  source,
  durationSeconds,
  visual,
  imageSrc,
  imageAlt,
}: LessonVideoPlayerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const usesElement = Boolean(source.src);
  const mock = useMockPlayback(durationSeconds);
  const element = useElementPlayback(videoRef, durationSeconds);
  const playback = usesElement ? element : mock;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const playLabel = playback.isPlaying ? "Pavza" : "Predvajaj";

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  async function toggleFullscreen() {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    try {
      if (document.fullscreenElement === node) {
        await document.exitFullscreen();
        return;
      }

      await node.requestFullscreen();
    } catch {
      setIsFullscreen(false);
    }
  }

  return (
    <section
      ref={containerRef}
      aria-label={title}
      className="relative aspect-video w-full overflow-hidden rounded-md bg-foreground shadow-[var(--shadow-card)]"
    >
      <VideoProviderAdapter
        source={source}
        title={title}
        visual={visual}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        videoRef={videoRef}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

      {!playback.isPlaying ? (
        <button
          type="button"
          onClick={playback.togglePlaying}
          aria-label={playLabel}
          className={cn(
            "absolute top-1/2 left-1/2 z-[1] flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_28px_rgba(28,25,22,0.28)]",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white",
            !reduceMotion && "transition-transform hover:scale-[1.03]",
          )}
        >
          <Play
            className="ml-0.5 h-7 w-7 fill-foreground text-foreground"
            strokeWidth={1.4}
            aria-hidden
          />
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/80 via-black/55 to-transparent px-2.5 pt-10 pb-2.5 sm:px-3.5 sm:pb-3">
        <div className="flex items-center gap-2 text-white sm:gap-3">
          <MediaIconButton
            label={playLabel}
            onClick={playback.togglePlaying}
            className="text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white"
          >
            {playback.isPlaying ? (
              <Pause className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            ) : (
              <Play className="h-4 w-4 fill-current" strokeWidth={1.8} aria-hidden />
            )}
          </MediaIconButton>

          <MediaIconButton
            label="Preskoči 10 sekund nazaj"
            onClick={() => playback.skip(-10)}
            className="hidden text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white sm:inline-flex"
          >
            <SkipBack className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <MediaIconButton
            label="Preskoči 10 sekund naprej"
            onClick={() => playback.skip(10)}
            className="hidden text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white sm:inline-flex"
          >
            <SkipForward className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <MediaIconButton
            label={playback.isMuted ? "Vklopi zvok" : "Utišaj"}
            onClick={playback.toggleMuted}
            className="text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white"
          >
            {playback.isMuted || playback.volume === 0 ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
          </MediaIconButton>

          <div className="hidden w-16 sm:block">
            <MediaSlider
              label="Glasnost"
              value={playback.isMuted ? 0 : playback.volume}
              max={1}
              step={0.05}
              onChange={playback.setVolume}
              valueText={`${Math.round((playback.isMuted ? 0 : playback.volume) * 100)} odstotkov`}
            />
          </div>

          <p
            className="shrink-0 text-[0.7rem] tabular-nums text-white/90 sm:text-[0.75rem]"
            aria-live="polite"
          >
            {formatTimecode(playback.currentTime)}
            <span className="text-white/55"> / {formatTimecode(playback.duration)}</span>
          </p>

          <div className="min-w-0 flex-1">
            <MediaSlider
              label="Napredovanje predvajanja"
              value={playback.currentTime}
              max={playback.duration}
              onChange={playback.seek}
              valueText={formatPlaybackClock(playback.currentTime, playback.duration)}
            />
          </div>

          <MediaIconButton
            label={`Hitrost predvajanja, trenutno ${playback.playbackRate}x`}
            onClick={playback.cyclePlaybackRate}
            className="hidden min-w-8 text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white sm:inline-flex"
          >
            <span className="text-[0.7rem] font-medium">{playback.playbackRate}x</span>
          </MediaIconButton>

          <MediaIconButton
            label={captionsOn ? "Skrij podnapise" : "Prikaži podnapise"}
            onClick={() => setCaptionsOn((current) => !current)}
            pressed={captionsOn}
            className={cn(
              "hidden text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white sm:inline-flex",
              captionsOn && "bg-white/12 text-white",
            )}
          >
            <Captions className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <MediaIconButton
            label={isFullscreen ? "Zapri celozaslonski prikaz" : "Celozaslonski prikaz"}
            onClick={() => {
              void toggleFullscreen();
            }}
            className="text-white/90 hover:bg-white/12 hover:text-white focus-visible:outline-white"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <Maximize className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
          </MediaIconButton>
        </div>
      </div>
    </section>
  );
}
