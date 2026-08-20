"use client";

import type { ChangeEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatTimecode } from "@/lib/owned-program/access";

export function MediaIconButton({
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
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function MediaSlider({
  label,
  value,
  max,
  onChange,
  valueText,
  step = 0.25,
  trackClassName,
  fillClassName,
  inputClassName,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  valueText: string;
  step?: number;
  trackClassName?: string;
  fillClassName?: string;
  inputClassName?: string;
}) {
  const safeMax = Math.max(0, max);
  const progress = safeMax > 0 ? Math.min(100, (value / safeMax) * 100) : 0;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <div className="relative flex h-6 items-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 h-1 overflow-hidden rounded-full bg-white/30",
          trackClassName,
        )}
        aria-hidden
      >
        <div
          className={cn("h-full rounded-full bg-accent", fillClassName)}
          style={{ width: `${progress}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={safeMax}
        step={step}
        value={Math.min(value, safeMax)}
        aria-label={label}
        aria-valuetext={valueText}
        onChange={handleChange}
        className={cn(
          "relative z-[1] h-6 w-full cursor-pointer appearance-none bg-transparent",
          "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white",
          "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white",
          inputClassName,
        )}
      />
    </div>
  );
}

export function formatPlaybackClock(currentTime: number, duration: number) {
  return `${formatTimecode(currentTime)} od ${formatTimecode(duration)}`;
}
