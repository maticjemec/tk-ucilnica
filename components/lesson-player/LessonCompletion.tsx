"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type LessonCompletionProps = {
  completed: boolean;
  pending?: boolean;
  error?: string | null;
  onComplete: () => void;
};

export function LessonCompletion({
  completed,
  pending = false,
  error,
  onComplete,
}: LessonCompletionProps) {
  return (
    <section
      aria-labelledby="lesson-completion-heading"
      className="flex h-full min-w-0 flex-col"
    >
      <h3
        id="lesson-completion-heading"
        className="text-[0.95rem] font-semibold tracking-tight text-foreground"
      >
        Označi kot opravljeno
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        S tem shraniš svoj napredek.
      </p>

      <div className="mt-4 flex flex-1 flex-col justify-end gap-2">
        <Button
          variant={completed ? "outline" : "primary"}
          className={cn(
            "w-full",
            completed &&
              "border-success/45 text-success-foreground hover:border-success/45 hover:bg-transparent disabled:opacity-100",
          )}
          disabled={completed || pending}
          aria-pressed={completed}
          aria-busy={pending}
          aria-label={completed ? "Lekcija je opravljena" : "Označi kot opravljeno"}
          onClick={completed || pending ? undefined : onComplete}
        >
          <Check className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          {completed ? "Opravljeno" : "Označi kot opravljeno"}
        </Button>
        {error ? (
          <p className="text-sm leading-snug text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
