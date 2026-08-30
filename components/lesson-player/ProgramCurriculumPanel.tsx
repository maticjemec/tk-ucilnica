import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { CurriculumLessonRow } from "@/components/owned-program/CurriculumLessonRow";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { formatProgressPercent } from "@/lib/progress/helpers";
import type { OwnedProgram, ResolvedLesson } from "@/types/owned-program";

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
  const progressLabel = `Napredek programa: ${formatProgressPercent(progressPercent)}`;
  const overviewHref = getOwnedProgramOverviewPath(program.slug);

  return (
    <Card padding="none" className="px-4 py-4 sm:px-5 sm:py-5">
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Vsebina programa
      </h2>

      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted">
        <p>Program: {program.totalDays} dni</p>
        <p className="tabular-nums text-foreground">
          Napredek {formatProgressPercent(progressPercent)}
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
                  <CurriculumLessonRow
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
        href={overviewHref}
        className="mt-4 flex items-center gap-2.5 rounded-md border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Info className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <span className="min-w-0 flex-1">O programu</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.7} aria-hidden />
      </Link>
    </Card>
  );
}
