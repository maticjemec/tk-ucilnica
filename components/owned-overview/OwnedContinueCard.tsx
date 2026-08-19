import { CirclePlay, Clock, Shield } from "lucide-react";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Card } from "@/components/ui/Card";
import { formatLessonHeading } from "@/lib/owned-program/access";
import type { OwnedOverviewModel } from "@/lib/owned-program/overview";

type OwnedContinueCardProps = {
  model: OwnedOverviewModel;
};

export function OwnedContinueCard({ model }: OwnedContinueCardProps) {
  const { program, currentLesson, continueHref, isCompleted, primaryCtaLabel } =
    model;
  const heading = formatLessonHeading(currentLesson);
  const ctaLabel = isCompleted ? primaryCtaLabel : "Nadaljuj lekcijo";

  return (
    <Card padding="none" className="px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.7} aria-hidden />
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
          Nadaljuj tam, kjer si ostal/a
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full shrink-0 overflow-hidden rounded-sm sm:w-[9.75rem]">
          <CoverMedia
            alt={program.imageAlt ?? heading}
            imageSrc={program.imageSrc}
            sizes="(min-width: 640px) 156px, 100vw"
            className="aspect-[16/10] w-full"
          >
            <ProgramPlaceholder visual={program.visual} />
          </CoverMedia>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
              <CirclePlay
                className="h-5 w-5 fill-foreground text-foreground"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug text-foreground">{heading}</p>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {currentLesson.description}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
            <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
            {currentLesson.duration}
          </p>
        </div>
      </div>

      <ButtonLink
        href={continueHref}
        variant={isCompleted ? "success-outline" : "primary"}
        className="mt-5 w-full sm:w-auto"
      >
        <CirclePlay className="h-4 w-4" strokeWidth={1.6} aria-hidden />
        {ctaLabel}
      </ButtonLink>
    </Card>
  );
}
