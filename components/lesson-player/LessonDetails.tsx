import { Card } from "@/components/ui/Card";
import { LessonCompletion } from "@/components/lesson-player/LessonCompletion";
import { LessonMaterials } from "@/components/lesson-player/LessonMaterials";
import { resolveLessonMedia } from "@/lib/media/resolveLessonMedia";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type { LessonCompletionNextStep } from "@/lib/owned-program/access";
import type { ProgramLesson } from "@/types/owned-program";

type LessonDetailsProps = {
  lesson: ProgramLesson;
  completed: boolean;
  pending?: boolean;
  error?: string | null;
  onComplete: () => void;
  programSlug: string;
  nextStep?: LessonCompletionNextStep | null;
};

export function LessonDetails({
  lesson,
  completed,
  pending,
  error,
  onComplete,
  programSlug,
  nextStep,
}: LessonDetailsProps) {
  const media = resolveLessonMedia(lesson);
  const showHeading = media.details.showHeading;
  const showDescription = media.details.showDescription;
  const showMaterials = media.details.showMaterials && lesson.resources.length > 0;
  const showIntro = showHeading || showDescription;

  return (
    <Card padding="none" className="mt-4 px-5 py-5 sm:mt-5 sm:px-6">
      {showHeading ? (
        <h2 className="font-serif text-[1.35rem] leading-snug font-medium tracking-tight text-foreground sm:text-[1.5rem]">
          {formatLessonHeading(lesson)}
        </h2>
      ) : null}
      {showDescription ? (
        <p className="mt-2 max-w-[42rem] text-sm leading-relaxed text-muted sm:text-[0.925rem]">
          {lesson.description}
        </p>
      ) : null}

      <div
        className={
          showMaterials
            ? `${showIntro ? "mt-5" : ""} grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-6`
            : showIntro
              ? "mt-5"
              : ""
        }
      >
        {showMaterials ? <LessonMaterials resources={lesson.resources} /> : null}
        <LessonCompletion
          completed={completed}
          pending={pending}
          error={error}
          onComplete={onComplete}
          programSlug={programSlug}
          nextStep={nextStep}
        />
      </div>
    </Card>
  );
}
