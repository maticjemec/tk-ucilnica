"use client";

import { useMemo, useState, useTransition } from "react";
import { LessonBreadcrumb } from "@/components/lesson-player/LessonBreadcrumb";
import { LessonDetails } from "@/components/lesson-player/LessonDetails";
import { LessonNavigation } from "@/components/lesson-player/LessonNavigation";
import { LessonProgramHeader } from "@/components/lesson-player/LessonProgramHeader";
import { ProgramCurriculumPanel } from "@/components/lesson-player/ProgramCurriculumPanel";
import { LessonMedia } from "@/components/lesson-media/LessonMedia";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { getOwnedLessonNav } from "@/lib/content/owned-program";
import {
  formatLessonHeading,
  formatLessonPosition,
  resolveOwnedLessons,
} from "@/lib/owned-program/access";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { markLessonCompleted } from "@/lib/progress/actions";
import {
  getProgramProgressPercent,
  PROGRESS_SAVE_ERROR,
} from "@/lib/progress/helpers";
import type {
  LessonAccessEntitlement,
  OwnedProgram,
  ProgramLesson,
} from "@/types/owned-program";

type LessonPlayerClientProps = {
  program: OwnedProgram;
  lesson: ProgramLesson;
  completedLessonIds: string[];
  entitlement: LessonAccessEntitlement | null;
};

export function LessonPlayerClient({
  program,
  lesson,
  completedLessonIds,
  entitlement,
}: LessonPlayerClientProps) {
  const [completedIds, setCompletedIds] = useState(completedLessonIds);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const access = { entitlement };
  const resolvedLessons = resolveOwnedLessons(
    program,
    lesson.id,
    completedSet,
    access,
  );
  const navigation = getOwnedLessonNav(
    program,
    lesson.slug,
    completedSet,
    access,
  );
  const completed = completedSet.has(lesson.id);
  const displayPercent = getProgramProgressPercent(
    completedSet.size,
    program.lessons.length,
  );

  function handleComplete() {
    if (completed || isPending) {
      return;
    }

    setSaveError(null);
    startTransition(async () => {
      const result = await markLessonCompleted(program.slug, lesson.slug);

      if (!result.ok) {
        setSaveError(result.error || PROGRESS_SAVE_ERROR);
        return;
      }

      setCompletedIds((current) =>
        current.includes(lesson.id) ? current : [...current, lesson.id],
      );
    });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-6">
        <div className="min-w-0">
          <LessonBreadcrumb
            items={[
              { label: "Moji programi", href: "/moji-programi" },
              {
                label: program.label,
                href: getOwnedProgramOverviewPath(program.slug),
              },
              { label: formatLessonHeading(lesson) },
            ]}
          />

          <LessonProgramHeader
            title={program.title}
            positionLabel={formatLessonPosition(lesson.day, program.totalDays)}
            progressPercent={displayPercent}
          />

          <LessonMedia
            key={lesson.id}
            lesson={lesson}
            visual={program.visual}
            imageSrc={program.imageSrc}
            imageAlt={program.imageAlt ?? program.label}
          />

          <LessonDetails
            lesson={lesson}
            completed={completed}
            pending={isPending}
            error={saveError}
            onComplete={handleComplete}
          />

          <LessonNavigation
            previous={navigation.previous}
            next={navigation.next}
          />
        </div>

        <aside className="min-w-0 lg:sticky lg:top-4">
          <ProgramCurriculumPanel
            program={program}
            lessons={resolvedLessons}
            currentLessonSlug={lesson.slug}
            progressPercent={displayPercent}
          />
        </aside>
      </div>

      <SupportCard />
    </>
  );
}
