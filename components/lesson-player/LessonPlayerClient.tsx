"use client";

import { LessonBreadcrumb } from "@/components/lesson-player/LessonBreadcrumb";
import { LessonDetails } from "@/components/lesson-player/LessonDetails";
import { LessonMediaPlayer } from "@/components/lesson-player/LessonMediaPlayer";
import { LessonNavigation } from "@/components/lesson-player/LessonNavigation";
import { LessonProgramHeader } from "@/components/lesson-player/LessonProgramHeader";
import { useOwnedProgress } from "@/components/lesson-player/OwnedProgressProvider";
import { ProgramCurriculumPanel } from "@/components/lesson-player/ProgramCurriculumPanel";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { getOwnedLessonNav } from "@/lib/content/owned-program";
import {
  formatLessonHeading,
  formatLessonPosition,
  resolveOwnedLessons,
} from "@/lib/owned-program/access";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import type { OwnedProgram, ProgramLesson } from "@/types/owned-program";

type LessonPlayerClientProps = {
  program: OwnedProgram;
  lesson: ProgramLesson;
};

export function LessonPlayerClient({
  program,
  lesson,
}: LessonPlayerClientProps) {
  const { completedIds, progressPercent, markComplete, isComplete } =
    useOwnedProgress();
  const resolvedLessons = resolveOwnedLessons(program, lesson.id, completedIds);
  const navigation = getOwnedLessonNav(program, lesson.slug);
  const completed = isComplete(lesson.id);

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
            progressPercent={progressPercent}
          />

          <LessonMediaPlayer
            key={lesson.id}
            title={formatLessonHeading(lesson)}
            media={lesson.media}
            visual={program.visual}
            imageSrc={program.imageSrc}
            imageAlt={program.imageAlt ?? program.label}
          />

          <LessonDetails
            lesson={lesson}
            completed={completed}
            onComplete={() => markComplete(lesson.id)}
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
            progressPercent={progressPercent}
          />
        </aside>
      </div>

      <SupportCard />
    </>
  );
}
