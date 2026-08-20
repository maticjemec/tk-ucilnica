"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export const MEDIA_PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2] as const;

export type MediaPlaybackRate = (typeof MEDIA_PLAYBACK_RATES)[number];

export type MediaPlaybackApi = {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: MediaPlaybackRate;
  togglePlaying: () => void;
  seek: (time: number) => void;
  skip: (delta: number) => void;
  restart: () => void;
  toggleMuted: () => void;
  setVolume: (volume: number) => void;
  cyclePlaybackRate: () => void;
};

function nextRate(current: MediaPlaybackRate): MediaPlaybackRate {
  const index = MEDIA_PLAYBACK_RATES.indexOf(current);
  return MEDIA_PLAYBACK_RATES[(index + 1) % MEDIA_PLAYBACK_RATES.length];
}

export function useMockPlayback(durationSeconds: number): MediaPlaybackApi {
  const duration = Math.max(0, durationSeconds);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRate] = useState<MediaPlaybackRate>(1);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentTime((time) => {
        const next = Math.min(duration, time + playbackRate * 0.25);
        if (next >= duration) {
          setIsPlaying(false);
        }
        return next;
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [duration, isPlaying, playbackRate]);

  const seek = useCallback(
    (time: number) => {
      setCurrentTime(Math.min(duration, Math.max(0, time)));
    },
    [duration],
  );

  const togglePlaying = useCallback(() => {
    setCurrentTime((time) => (time >= duration ? 0 : time));
    setIsPlaying((current) => !current);
  }, [duration]);

  return {
    currentTime,
    duration,
    isPlaying,
    isMuted,
    volume,
    playbackRate,
    togglePlaying,
    seek,
    skip: (delta) => seek(currentTime + delta),
    restart: () => {
      seek(0);
    },
    toggleMuted: () => setIsMuted((current) => !current),
    setVolume: (value) => {
      const next = Math.min(1, Math.max(0, value));
      setVolumeState(next);
      setIsMuted(next === 0);
    },
    cyclePlaybackRate: () => setPlaybackRate((current) => nextRate(current)),
  };
}

export function useElementPlayback(
  ref: RefObject<HTMLMediaElement | null>,
  durationFallback: number,
): MediaPlaybackApi {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationFallback);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRate] = useState<MediaPlaybackRate>(1);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const sync = () => {
      setCurrentTime(node.currentTime);
      if (Number.isFinite(node.duration) && node.duration > 0) {
        setDuration(node.duration);
      }
      setIsPlaying(!node.paused);
      setIsMuted(node.muted);
      setVolumeState(node.volume);
    };

    node.addEventListener("timeupdate", sync);
    node.addEventListener("durationchange", sync);
    node.addEventListener("play", sync);
    node.addEventListener("pause", sync);
    node.addEventListener("ended", sync);
    sync();

    return () => {
      node.removeEventListener("timeupdate", sync);
      node.removeEventListener("durationchange", sync);
      node.removeEventListener("play", sync);
      node.removeEventListener("pause", sync);
      node.removeEventListener("ended", sync);
    };
  }, [ref]);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.playbackRate = playbackRate;
    }
  }, [playbackRate, ref]);

  const seek = useCallback(
    (time: number) => {
      const node = ref.current;
      const next = Math.min(duration, Math.max(0, time));
      if (node) {
        node.currentTime = next;
      }
      setCurrentTime(next);
    },
    [duration, ref],
  );

  const togglePlaying = useCallback(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (node.ended || node.currentTime >= duration) {
      node.currentTime = 0;
    }

    if (node.paused) {
      void node.play();
    } else {
      node.pause();
    }
  }, [duration, ref]);

  return {
    currentTime,
    duration,
    isPlaying,
    isMuted,
    volume,
    playbackRate,
    togglePlaying,
    seek,
    skip: (delta) => seek(currentTime + delta),
    restart: () => seek(0),
    toggleMuted: () => {
      const node = ref.current;
      const next = !isMuted;
      if (node) {
        node.muted = next;
      }
      setIsMuted(next);
    },
    setVolume: (value) => {
      const next = Math.min(1, Math.max(0, value));
      const node = ref.current;
      if (node) {
        node.volume = next;
        node.muted = next === 0;
      }
      setVolumeState(next);
      setIsMuted(next === 0);
    },
    cyclePlaybackRate: () => setPlaybackRate((current) => nextRate(current)),
  };
}
