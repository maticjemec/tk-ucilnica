"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CurriculumLessonRow } from "@/components/owned-program/CurriculumLessonRow";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ProgramSection, ResolvedLesson } from "@/types/owned-program";

type SectionProgress = {
  sectionId: string;
  completed: number;
  total: number;
  label: string;
};

type OwnedCurriculumProps = {
  sections: ProgramSection[];
  lessons: ResolvedLesson[];
  sectionProgress: SectionProgress[];
  currentLessonSlug: string;
};

export function OwnedCurriculum({
  sections,
  lessons,
  sectionProgress,
  currentLessonSlug,
}: OwnedCurriculumProps) {
  const lessonById = useMemo(
    () => new Map(lessons.map((lesson) => [lesson.id, lesson])),
    [lessons],
  );
  const progressBySection = useMemo(
    () => new Map(sectionProgress.map((item) => [item.sectionId, item])),
    [sectionProgress],
  );
  const currentSectionId = useMemo(() => {
    const current = lessons.find((lesson) => lesson.slug === currentLessonSlug);
    return sections.find((section) =>
      current ? section.lessonIds.includes(current.id) : false,
    )?.id;
  }, [currentLessonSlug, lessons, sections]);

  const [openIds, setOpenIds] = useState<string[]>(() =>
    currentSectionId ? [currentSectionId] : sections[0] ? [sections[0].id] : [],
  );

  function toggle(sectionId: string) {
    setOpenIds((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );
  }

  return (
    <Card padding="none" className="px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="font-serif text-[1.45rem] leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
        Vsebina programa
      </h2>

      <div className="mt-4 divide-y divide-border">
        {sections.map((section) => {
          const open = openIds.includes(section.id);
          const progress = progressBySection.get(section.id);
          const sectionLessons = section.lessonIds
            .map((id) => lessonById.get(id))
            .filter((lesson): lesson is ResolvedLesson => Boolean(lesson));
          const headingId = `owned-section-${section.id}`;
          const panelId = `${headingId}-panel`;

          return (
            <section key={section.id} className="py-3 first:pt-1 last:pb-0">
              <h3 id={headingId} className="min-w-0">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-sm py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(section.id)}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.82rem] font-semibold tracking-[0.04em] text-foreground uppercase">
                      {section.title}
                    </span>
                    {progress ? (
                      <span className="mt-0.5 block text-[0.78rem] text-muted">
                        {progress.label}
                      </span>
                    ) : null}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted transition-transform",
                      open && "rotate-180",
                    )}
                    strokeWidth={1.8}
                    aria-hidden
                  />
                </button>
              </h3>

              <ol
                id={panelId}
                role="list"
                hidden={!open}
                className={cn("relative mt-2", !open && "hidden")}
                aria-labelledby={headingId}
              >
                <span
                  className="absolute top-3 bottom-3 left-[calc(0.5rem+0.875rem)] w-px bg-border"
                  aria-hidden
                />
                {sectionLessons.map((lesson) => (
                  <CurriculumLessonRow
                    key={lesson.id}
                    lesson={lesson}
                    size="comfortable"
                  />
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </Card>
  );
}
