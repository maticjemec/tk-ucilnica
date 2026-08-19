import Link from "next/link";
import {
  CurriculumStatusIcon,
  CurriculumTimelineMarker,
} from "@/components/owned-program/CurriculumMarkers";
import { cn } from "@/lib/cn";
import {
  formatLessonHeading,
  getLessonAccessLabel,
} from "@/lib/owned-program/access";
import type { ResolvedLesson } from "@/types/owned-program";

type CurriculumLessonRowProps = {
  lesson: ResolvedLesson;
  isViewing?: boolean;
  size?: "compact" | "comfortable";
};

export function CurriculumLessonRow({
  lesson,
  isViewing = false,
  size = "compact",
}: CurriculumLessonRowProps) {
  const heading = formatLessonHeading(lesson);
  const interactive = lesson.accessState !== "locked";
  const className = cn(
    "relative grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)_2.85rem_1rem] items-center gap-x-1.5 rounded-sm px-1",
    size === "compact" ? "py-[0.4rem]" : "gap-x-2.5 px-2 py-2 sm:px-2.5",
    lesson.accessState === "current" && "bg-warning-soft",
    interactive &&
      "transition-colors hover:bg-warning-soft/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  );

  const content = (
    <>
      <CurriculumTimelineMarker state={lesson.accessState} />
      <span className="min-w-0 line-clamp-2 text-[0.82rem] leading-snug break-words text-foreground">
        {heading}
        <span className="sr-only">, {getLessonAccessLabel(lesson.accessState)}</span>
      </span>
      <span className="w-full text-right text-[0.72rem] leading-none whitespace-nowrap tabular-nums text-muted">
        {lesson.duration}
      </span>
      <CurriculumStatusIcon state={lesson.accessState} />
    </>
  );

  if (!interactive) {
    return (
      <li className="min-w-0">
        <div className={className}>{content}</div>
      </li>
    );
  }

  return (
    <li className="min-w-0">
      <Link
        href={lesson.href}
        className={className}
        aria-current={isViewing ? "page" : lesson.accessState === "current" ? "step" : undefined}
      >
        {content}
      </Link>
    </li>
  );
}
