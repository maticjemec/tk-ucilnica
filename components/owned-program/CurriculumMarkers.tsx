import { Check, Lock, Play } from "lucide-react";
import { cn } from "@/lib/cn";
import type { LessonAccessState } from "@/types/owned-program";

export function CurriculumTimelineMarker({
  state,
}: {
  state: LessonAccessState;
}) {
  const base =
    "relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border bg-surface";

  if (state === "completed") {
    return (
      <span className={cn(base, "border-accent bg-accent text-accent-foreground")}>
        <Check className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
      </span>
    );
  }

  if (state === "current") {
    return (
      <span
        className={cn(
          base,
          "border-accent bg-accent text-accent-foreground shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)]",
        )}
      >
        <Play className="ml-px h-3.5 w-3.5 fill-current" strokeWidth={1.6} aria-hidden />
      </span>
    );
  }

  if (state === "locked") {
    return (
      <span className={cn(base, "border-border bg-canvas text-muted")}>
        <Lock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
      </span>
    );
  }

  return <span className={cn(base, "border-border/90 bg-surface")} />;
}

export function CurriculumStatusIcon({ state }: { state: LessonAccessState }) {
  if (state === "completed") {
    return (
      <Check className="h-4 w-4 justify-self-end text-accent" strokeWidth={2} aria-hidden />
    );
  }

  if (state === "current") {
    return (
      <Play
        className="h-3.5 w-3.5 justify-self-end fill-accent text-accent"
        strokeWidth={1.6}
        aria-hidden
      />
    );
  }

  if (state === "locked") {
    return (
      <Lock
        className="h-3.5 w-3.5 justify-self-end text-muted/80"
        strokeWidth={1.7}
        aria-hidden
      />
    );
  }

  return <span className="h-4 w-4 justify-self-end" aria-hidden />;
}
