"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type {
  ProgramAccessState,
  ProgramCurriculumItem,
} from "@/types/program-detail";

const PREVIEW_COUNT = 5;

type ProgramCurriculumProps = {
  items: ProgramCurriculumItem[];
  accessState: ProgramAccessState;
  className?: string;
};

export function ProgramCurriculum({
  items,
  accessState,
  className,
}: ProgramCurriculumProps) {
  const [expanded, setExpanded] = useState(false);
  const owned = accessState === "owned";
  const canExpand = items.length > PREVIEW_COUNT;

  const visible = useMemo(() => {
    if (expanded || !canExpand) {
      return items;
    }

    const preview = items.filter((item) => item.isPreview);
    return (preview.length > 0 ? preview : items).slice(0, PREVIEW_COUNT);
  }, [canExpand, expanded, items]);

  return (
    <Card padding="none" className={cn("px-5 py-5 sm:px-6 sm:py-6", className)}>
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Vsebina programa
      </h2>

      <ol className="relative mt-5">
        <span
          className="absolute top-3.5 bottom-3.5 left-[0.875rem] w-px bg-border/90"
          aria-hidden
        />
        {visible.map((item) => {
          return (
            <li
              key={item.id}
              className="relative grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)_auto_1rem] items-center gap-x-2.5 py-2.5 first:pt-0 last:pb-0 sm:gap-x-3.5"
            >
              <span className="relative z-[1] flex h-7 w-7 items-center justify-center rounded-full border border-accent/40 bg-surface text-[0.75rem] font-medium text-accent">
                {item.order}
              </span>

              <p className="min-w-0 text-sm leading-snug text-foreground">
                {item.title}
              </p>

              <span className="flex min-w-[3.25rem] shrink-0 items-center justify-end gap-1.5 whitespace-nowrap text-[0.8rem] text-muted sm:min-w-[4.75rem]">
                <Clock
                  className="hidden h-3.5 w-3.5 sm:block"
                  strokeWidth={1.6}
                  aria-hidden
                />
                {item.duration}
              </span>

              <span className="flex h-4 w-4 items-center justify-center">
                {owned ? null : (
                  <Lock
                    className="h-3.5 w-3.5 text-muted/80"
                    strokeWidth={1.7}
                    aria-hidden
                  />
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {canExpand ? (
        <button
          type="button"
          className="mt-5 inline-flex items-center gap-1 text-sm text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded
            ? "Pokaži manj"
            : `Poglej vseh ${items.length} lekcij`}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180",
            )}
            strokeWidth={1.7}
            aria-hidden
          />
        </button>
      ) : null}
    </Card>
  );
}
