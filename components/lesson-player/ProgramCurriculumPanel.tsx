import Link from "next/link";
import { ArrowRight, Check, Info, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/cn";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type {
  LessonAccessState,
  OwnedProgram,
  ResolvedLesson,
} from "@/types/owned-program";

type ProgramCurriculumPanelProps = {
  program: OwnedProgram;
  lessons: ResolvedLesson[];
  currentLessonSlug: string;
  progressPercent: number;
};

export function ProgramCurriculumPanel({
  program,
  lessons,
  currentLessonSlug,
  progressPercent,
}: ProgramCurriculumPanelProps) {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const progressLabel = `Napredek programa: ${progressPercent} %`;

  return (
    <Card padding="none" className="px-4 py-4 sm:px-5 sm:py-5">
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Vsebina programa
      </h2>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
        <p>Program: {program.totalDays} dni</p>
        <p className="tabular-nums text-foreground">
          Napredek {progressPercent} %
        </p>
      </div>
      <Progress
        value={progressPercent}
        label={progressLabel}
        className="mt-2 h-1.5"
      />

      <div className="mt-4 flex flex-col gap-4">
        {program.sections.map((section) => {
          const sectionLessons = section.lessonIds
            .map((id) => lessonById.get(id))
            .filter((lesson): lesson is ResolvedLesson => Boolean(lesson));

          return (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <h3 id={`section-${section.id}`} className="ui-label mb-1.5">
                {section.title}
              </h3>

              <ol className="relative">
                <span
                  className="absolute top-3 bottom-3 left-[1.125rem] w-px bg-border"
                  aria-hidden
                />
                {sectionLessons.map((lesson) => (
                  <CurriculumRow
                    key={lesson.id}
                    lesson={lesson}
                    isViewing={lesson.slug === currentLessonSlug}
                  />
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <Link
        href="/moji-programi"
        aria-label="O programu. Pregled lastnega programa pride kasneje, zato te povezava vrne na Moji programi."
        className="mt-4 flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Info className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <span className="min-w-0 flex-1">O programu</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.7} aria-hidden />
      </Link>
    </Card>
  );
}

function CurriculumRow({
  lesson,
  isViewing,
}: {
  lesson: ResolvedLesson;
  isViewing: boolean;
}) {
  const heading = formatLessonHeading(lesson);
  const interactive = lesson.accessState !== "locked";
  const className = cn(
    "relative grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)_2.85rem_1rem] items-center gap-x-1.5 rounded-sm px-1 py-[0.4rem]",
    lesson.accessState === "current" && "bg-warning-soft",
    interactive &&
      "transition-colors hover:bg-warning-soft/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  );

  const content = (
    <>
      <TimelineMarker state={lesson.accessState} />
      <span className="min-w-0 line-clamp-2 text-[0.82rem] leading-snug break-words text-foreground">
        {heading}
        <span className="sr-only">, {accessLabel(lesson.accessState)}</span>
      </span>
      <span className="w-full text-right text-[0.72rem] leading-none whitespace-nowrap tabular-nums text-muted">
        {lesson.duration}
      </span>
      <StatusIcon state={lesson.accessState} />
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
        aria-current={isViewing ? "page" : undefined}
      >
        {content}
      </Link>
    </li>
  );
}

function TimelineMarker({ state }: { state: LessonAccessState }) {
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
      <span className={cn(base, "border-accent bg-accent text-accent-foreground shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)]")}>
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

function StatusIcon({ state }: { state: LessonAccessState }) {
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

function accessLabel(state: LessonAccessState) {
  switch (state) {
    case "completed":
      return "opravljeno";
    case "current":
      return "trenutna lekcija";
    case "available":
      return "na voljo";
    case "locked":
      return "zaklenjeno";
  }
}
