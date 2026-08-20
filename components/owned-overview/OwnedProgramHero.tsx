import { BarChart3, BookOpen, CirclePlay, Clock } from "lucide-react";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import type { OwnedOverviewModel } from "@/lib/owned-program/overview";

type OwnedProgramHeroProps = {
  model: OwnedOverviewModel;
};

export function OwnedProgramHero({ model }: OwnedProgramHeroProps) {
  const {
    program,
    progressPercent,
    positionLabel,
    continueHref,
    primaryCtaLabel,
    isCompleted,
    statusLabel,
    lessonCountLabel,
    durationLabel,
    difficulty,
    categoryLabel,
  } = model;
  const progressLabel = `Napredek programa: ${progressPercent} %`;

  return (
    <section className="overflow-hidden rounded-md border border-border bg-surface shadow-[var(--shadow-card)]">
      <div className="relative min-h-[21rem] sm:min-h-[23.5rem] lg:min-h-[25.5rem]">
        <div className="absolute inset-0">
          <CoverMedia
            alt={program.imageAlt ?? program.label}
            imageSrc={program.imageSrc}
            preload
            sizes="(min-width: 1440px) 72vw, 100vw"
            className="h-full w-full"
          >
            <ProgramPlaceholder visual={program.visual} variant="hero" />
          </CoverMedia>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_42%,rgba(232,176,112,0.26),transparent_58%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f7f2ea]/94 from-[3%] via-[#f7f2ea]/68 via-[36%] to-transparent to-[72%]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#f7f2ea]/55 via-transparent to-transparent" />

        <div className="relative flex min-h-[21rem] max-w-[38rem] flex-col justify-end px-5 py-6 sm:min-h-[23.5rem] sm:justify-center sm:px-8 lg:min-h-[25.5rem] lg:px-10 lg:py-8">
          <Badge
            variant="accent"
            className="w-fit border-transparent bg-[#a45c4e]/90 text-white"
          >
            {categoryLabel}
          </Badge>

          <h1 className="program-title mt-3 text-[1.45rem] leading-[1.22] sm:text-[1.85rem] lg:text-[2.05rem]">
            {program.title}
          </h1>
          <p className="mt-2.5 max-w-[32rem] text-[0.925rem] leading-relaxed text-muted">
            {program.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
              {lessonCountLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
              {durationLabel}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
              {difficulty}
            </span>
          </div>

          <div className="mt-5 max-w-[22rem]">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="text-sm text-muted">Napredek programa</p>
              <p className="text-[1.35rem] leading-none font-medium tabular-nums text-foreground">
                {progressPercent} %
              </p>
            </div>
            <Progress
              value={progressPercent}
              label={progressLabel}
              variant={isCompleted ? "success" : "accent"}
              className="h-1.5"
            />
            <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
              <span>{positionLabel}</span>
              {isCompleted ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="text-success-foreground">{statusLabel}</span>
                </>
              ) : null}
            </div>
          </div>

          {model.hasCurriculum ? (
            <ButtonLink
              href={continueHref}
              variant={isCompleted ? "success-outline" : "primary"}
              className="mt-5 w-full lg:hidden"
            >
              <CirclePlay className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              {primaryCtaLabel}
            </ButtonLink>
          ) : null}
        </div>

        {model.hasCurriculum ? (
          <div className="absolute top-5 right-5 hidden lg:block">
            <ButtonLink
              href={continueHref}
              variant={isCompleted ? "success-outline" : "primary"}
              className="min-w-[11.75rem] shadow-[0_8px_24px_rgba(28,25,22,0.12)]"
            >
              <CirclePlay className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              {primaryCtaLabel}
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </section>
  );
}
