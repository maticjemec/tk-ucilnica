import { Card } from "@/components/ui/Card";
import { LessonCompletion } from "@/components/lesson-player/LessonCompletion";
import { LessonMaterials } from "@/components/lesson-player/LessonMaterials";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type { ProgramLesson } from "@/types/owned-program";

type LessonDetailsProps = {
  lesson: ProgramLesson;
  completed: boolean;
  onComplete: () => void;
};

export function LessonDetails({
  lesson,
  completed,
  onComplete,
}: LessonDetailsProps) {
  return (
    <Card padding="none" className="mt-4 px-5 py-5 sm:mt-5 sm:px-6">
      <h2 className="font-serif text-[1.35rem] leading-snug font-medium tracking-tight text-foreground sm:text-[1.5rem]">
        {formatLessonHeading(lesson)}
      </h2>
      <p className="mt-2 max-w-[42rem] text-sm leading-relaxed text-muted sm:text-[0.925rem]">
        {lesson.description}
      </p>

      <div
        className={
          lesson.resources.length > 0
            ? "mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-6"
            : "mt-5"
        }
      >
        <LessonMaterials resources={lesson.resources} />
        <LessonCompletion completed={completed} onComplete={onComplete} />
      </div>
    </Card>
  );
}
