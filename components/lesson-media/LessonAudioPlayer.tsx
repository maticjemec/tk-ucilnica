"use client";

import { useRef } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import {
  formatPlaybackClock,
  MediaIconButton,
  MediaSlider,
} from "@/components/lesson-media/controls";
import {
  useElementPlayback,
  useMockPlayback,
} from "@/components/lesson-media/use-playback";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatTimecode } from "@/lib/owned-program/access";
import type { LessonAudioSource } from "@/lib/media/types";
import type { ProgramVisualId } from "@/types/dashboard";

type LessonAudioPlayerProps = {
  title: string;
  heading: string;
  source: LessonAudioSource;
  durationSeconds: number;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
  variant?: "featured" | "inline";
  showHeading?: boolean;
};

export function LessonAudioPlayer({
  title,
  heading,
  source,
  durationSeconds,
  visual,
  imageSrc,
  imageAlt,
  variant = "featured",
  showHeading = true,
}: LessonAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const usesElement = Boolean(source.src);
  const mock = useMockPlayback(durationSeconds);
  const element = useElementPlayback(audioRef, durationSeconds);
  const playback = usesElement ? element : mock;
  const playLabel = playback.isPlaying ? "Pavza" : "Predvajaj";
  const featured = variant === "featured";

  return (
    <Card padding="none" className="overflow-hidden">
      {source.src ? (
        <audio ref={audioRef} src={source.src} preload="metadata" className="hidden" />
      ) : null}

      {featured ? (
        <div className="relative">
          <CoverMedia
            alt={imageAlt}
            imageSrc={imageSrc}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="aspect-[2.4/1] w-full min-h-[7.5rem] sm:min-h-[9rem]"
          >
            <ProgramPlaceholder visual={visual} variant="hero" />
          </CoverMedia>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f7f2ea]/92 via-[#f7f2ea]/35 to-transparent" />
        </div>
      ) : null}

      <div className={cn("px-5 py-5 sm:px-6 sm:py-6", featured && "-mt-6 relative")}>
        {showHeading ? (
          <>
            <p className="ui-label">Avdio lekcija</p>
            <h2 className="mt-1.5 font-serif text-[1.35rem] leading-snug font-medium tracking-tight text-foreground sm:text-[1.5rem]">
              {heading}
            </h2>
            <p className="mt-1 text-sm text-muted">{title}</p>
          </>
        ) : (
          <p className="ui-label">Avdio</p>
        )}

        <div className="mt-5">
          <MediaSlider
            label="Napredovanje predvajanja"
            value={playback.currentTime}
            max={playback.duration}
            onChange={playback.seek}
            valueText={formatPlaybackClock(playback.currentTime, playback.duration)}
            trackClassName="bg-border"
            inputClassName="[&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:bg-accent"
          />
          <div className="mt-1.5 flex items-center justify-between text-[0.75rem] tabular-nums text-muted">
            <span aria-live="polite">{formatTimecode(playback.currentTime)}</span>
            <span>{formatTimecode(playback.duration)}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <MediaIconButton
            label="Na začetek"
            onClick={playback.restart}
            className="text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-accent"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <MediaIconButton
            label="Preskoči 10 sekund nazaj"
            onClick={() => playback.skip(-10)}
            className="text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-accent"
          >
            <SkipBack className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <button
            type="button"
            aria-label={playLabel}
            onClick={playback.togglePlaying}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-[0_8px_20px_rgba(166,124,82,0.28)] transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent"
          >
            {playback.isPlaying ? (
              <Pause className="h-5 w-5" strokeWidth={1.8} aria-hidden />
            ) : (
              <Play className="ml-0.5 h-5 w-5 fill-current" strokeWidth={1.6} aria-hidden />
            )}
          </button>

          <MediaIconButton
            label="Preskoči 10 sekund naprej"
            onClick={() => playback.skip(10)}
            className="text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-accent"
          >
            <SkipForward className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </MediaIconButton>

          <MediaIconButton
            label={playback.isMuted ? "Vklopi zvok" : "Utišaj"}
            onClick={playback.toggleMuted}
            className="text-muted hover:bg-canvas hover:text-foreground focus-visible:outline-accent"
          >
            {playback.isMuted || playback.volume === 0 ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
          </MediaIconButton>

          <div className="w-20">
            <MediaSlider
              label="Glasnost"
              value={playback.isMuted ? 0 : playback.volume}
              max={1}
              step={0.05}
              onChange={playback.setVolume}
              valueText={`${Math.round((playback.isMuted ? 0 : playback.volume) * 100)} odstotkov`}
              trackClassName="bg-border"
              inputClassName="[&::-moz-range-thumb]:bg-accent [&::-webkit-slider-thumb]:bg-accent"
            />
          </div>

          <button
            type="button"
            aria-label={`Hitrost predvajanja, trenutno ${playback.playbackRate}x`}
            onClick={playback.cyclePlaybackRate}
            className="ml-auto inline-flex h-8 min-w-12 items-center justify-center rounded-sm px-2 text-[0.75rem] font-medium text-foreground transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {playback.playbackRate}x
          </button>
        </div>
      </div>
    </Card>
  );
}
