import { Play } from "lucide-react";
import type { ContinueLesson } from "@/types/dashboard";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Card } from "@/components/ui/Card";

type ContinueLessonCardProps = {
  lesson: ContinueLesson;
};

export function ContinueLessonCard({ lesson }: ContinueLessonCardProps) {
  return (
    <Card padding="none" className="px-5 py-4">
      <h2 className="font-serif text-lg tracking-tight text-foreground">
        {lesson.heading}
      </h2>

      <div className="mt-3 flex items-center gap-3">
        <div className="relative shrink-0">
          <CoverMedia
            alt={lesson.imageAlt ?? lesson.title}
            imageSrc={lesson.imageSrc}
            sizes="96px"
            className="relative h-[3.85rem] w-[5.35rem] rounded-sm"
          >
            <ProgramPlaceholder visual={lesson.visual} />
          </CoverMedia>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
              <Play
                className="ml-0.5 h-3 w-3 fill-foreground text-foreground"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
          </span>
        </div>

        <div className="min-w-0">
          <p className="font-medium leading-snug text-foreground">{lesson.title}</p>
          <p className="mt-0.5 text-sm leading-snug text-muted">{lesson.program}</p>
        </div>
      </div>

      {lesson.duration ? (
        <p className="mt-3 text-sm text-muted">{lesson.duration}</p>
      ) : null}

      <ButtonLink href={lesson.href} prefetch={false} className="mt-4 w-full">
        {lesson.ctaLabel}
      </ButtonLink>
    </Card>
  );
}
