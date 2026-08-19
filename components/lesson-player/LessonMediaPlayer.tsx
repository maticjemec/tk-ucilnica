"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Captions,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { cn } from "@/lib/cn";
import { formatTimecode } from "@/lib/owned-program/access";
import type { ProgramVisualId } from "@/types/dashboard";
import type { LessonMedia } from "@/types/owned-program";

const PLAYBACK_RATES = [1, 1.25, 1.5, 2] as const;

type LessonMediaPlayerProps = {
  title: string;
  media: LessonMedia;
  visual: ProgramVisualId;
  imageSrc?: string;
  imageAlt: string;
};

export function LessonMediaPlayer({
  title,
  media,
  visual,
  imageSrc,
  imageAlt,
}: LessonMediaPlayerProps) {
  const playerId = useId();
  const containerRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<(typeof PLAYBACK_RATES)[number]>(1);
  const [currentTime, setCurrentTime] = useState(() =>
    Math.min(134, Math.max(0, media.durationSeconds - 1)),
  );

  const duration = media.durationSeconds;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentTime((time) => {
        const next = Math.min(duration, time + playbackRate);
        if (next >= duration) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [duration, isPlaying, playbackRate]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  function togglePlaying() {
    if (currentTime >= duration) {
      setCurrentTime(0);
    }
    setIsPlaying((current) => !current);
  }

  function cyclePlaybackRate() {
    const index = PLAYBACK_RATES.indexOf(playbackRate);
    setPlaybackRate(PLAYBACK_RATES[(index + 1) % PLAYBACK_RATES.length]);
  }

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

  function skipForward() {
    setCurrentTime((time) => Math.min(duration, time + 10));
  }

  const playLabel = isPlaying ? "Pavza" : "Predvajaj";

  return (
    <section
      ref={containerRef}
      aria-label={title}
      className="relative overflow-hidden rounded-md bg-foreground shadow-[var(--shadow-card)]"
    >
      <CoverMedia
        alt={imageAlt}
        imageSrc={imageSrc}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="aspect-video w-full"
      >
        <ProgramPlaceholder visual={visual} variant="hero" />
      </CoverMedia>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

      {!isPlaying ? (
        <button
          type="button"
          onClick={togglePlaying}
          aria-label={playLabel}
          className={cn(
            "absolute top-1/2 left-1/2 z-[1] flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_8px_28px_rgba(28,25,22,0.28)]",
            "transition-transform hover:scale-[1.03]",
            "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white",
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
          <PlayerIconButton label={playLabel} onClick={togglePlaying}>
            {isPlaying ? (
              <Pause className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            ) : (
              <Play className="h-4 w-4 fill-current" strokeWidth={1.8} aria-hidden />
            )}
          </PlayerIconButton>

          <PlayerIconButton
            label="Preskoči 10 sekund naprej"
            onClick={skipForward}
            className="hidden sm:inline-flex"
          >
            <SkipForward className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </PlayerIconButton>

          <PlayerIconButton
            label={isMuted ? "Vklopi zvok" : "Utišaj"}
            onClick={() => setIsMuted((current) => !current)}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
          </PlayerIconButton>

          <p
            className="shrink-0 text-[0.7rem] tabular-nums text-white/90 sm:text-[0.75rem]"
            aria-live="polite"
          >
            {formatTimecode(currentTime)}
            <span className="text-white/55"> / {formatTimecode(duration)}</span>
          </p>

          <div className="min-w-0 flex-1">
            <div
              role="slider"
              aria-label="Napredovanje predvajanja"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={Math.round(currentTime)}
              aria-valuetext={`${formatTimecode(currentTime)} od ${formatTimecode(duration)}`}
              aria-controls={playerId}
              tabIndex={0}
              className="flex h-6 cursor-pointer items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const ratio = (event.clientX - rect.left) / rect.width;
                setCurrentTime(Math.round(Math.min(1, Math.max(0, ratio)) * duration));
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault();
                  skipForward();
                }
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setCurrentTime((time) => Math.max(0, time - 10));
                }
              }}
            >
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/30">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <PlayerIconButton
            label={`Hitrost predvajanja, trenutno ${playbackRate}x`}
            onClick={cyclePlaybackRate}
            className="hidden min-w-8 sm:inline-flex"
          >
            <span className="text-[0.7rem] font-medium">{playbackRate}x</span>
          </PlayerIconButton>

          <PlayerIconButton
            label={captionsOn ? "Skrij podnapise" : "Prikaži podnapise"}
            onClick={() => setCaptionsOn((current) => !current)}
            className="hidden sm:inline-flex"
            pressed={captionsOn}
          >
            <Captions className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </PlayerIconButton>

          <PlayerIconButton
            label="Nastavitve predvajanja"
            className="hidden sm:inline-flex"
          >
            <Settings className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </PlayerIconButton>

          <PlayerIconButton
            label={isFullscreen ? "Zapri celozaslonski prikaz" : "Celozaslonski prikaz"}
            onClick={() => {
              void toggleFullscreen();
            }}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            ) : (
              <Maximize className="h-4 w-4" strokeWidth={1.7} aria-hidden />
            )}
          </PlayerIconButton>
        </div>
      </div>

      <span id={playerId} className="sr-only">
        {title}
      </span>
    </section>
  );
}

function PlayerIconButton({
  label,
  children,
  className,
  pressed,
  onClick,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  pressed?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-white/90 transition-colors",
        "hover:bg-white/12 hover:text-white",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        pressed && "bg-white/12 text-white",
        className,
      )}
    >
      {children}
    </button>
  );
}
