"use client";

import { BookOpen, CirclePlay, Clock, RotateCcw } from "lucide-react";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { getOwnedProgramContinueHref } from "@/lib/content/owned-program";
import type { PurchasedProgram } from "@/types/programs";

type PurchasedProgramCardProps = {
  program: PurchasedProgram;
};

export function PurchasedProgramCard({ program }: PurchasedProgramCardProps) {
  const completed = program.status === "completed";
  const ownedOverviewHref = `/moji-programi/${program.slug}`;
  const continueHref =
    getOwnedProgramContinueHref(program.slug) ?? ownedOverviewHref;
  const titleId = `program-title-${program.slug}`;

  return (
    <Card padding="none" className="overflow-hidden">
      <article
        aria-labelledby={titleId}
        className="flex flex-col md:flex-row md:items-stretch"
      >
        <div className="p-3.5 pb-0 md:w-[38%] md:shrink-0 md:self-stretch md:p-3.5 md:pr-2 lg:w-[28%] lg:p-4 lg:pr-2">
          <CoverMedia
            alt={program.imageAlt ?? program.label}
            imageSrc={program.imageSrc}
            sizes="(min-width: 1024px) 28vw, (min-width: 768px) 38vw, 100vw"
            className="aspect-[16/10] w-full rounded-md md:h-full md:aspect-auto md:min-h-[12.25rem]"
          >
            <ProgramPlaceholder visual={program.visual} />
          </CoverMedia>
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col justify-center px-5 pt-4 pb-3 md:px-5 md:pt-4 md:pb-2 lg:px-6 lg:py-5 xl:px-7">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <h3 id={titleId} className="program-title text-[0.98rem] lg:text-[1.05rem]">
                {program.title}
              </h3>
              <Badge variant={completed ? "success" : "accent"}>
                {completed ? "Zaključen" : "V teku"}
              </Badge>
            </div>

            <p className="mt-2 max-w-[36rem] text-sm leading-relaxed text-muted">
              {program.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="shrink-0 text-sm text-muted">Napredek</span>
              <Progress
                value={program.progress}
                variant={completed ? "success" : "accent"}
                label={`Napredek: ${program.label}`}
                className="h-1.5 flex-1"
              />
              <span className="w-11 shrink-0 text-right text-sm tabular-nums text-muted">
                {program.progress}%
              </span>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                {program.lessons}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                {program.duration}
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-start justify-center gap-2.5 px-5 pt-1 pb-5 md:px-5 md:pt-2 md:pb-5 lg:w-[11.5rem] lg:shrink-0 lg:items-center lg:px-4 lg:py-5">
            {completed ? (
              <ButtonLink
                href={continueHref}
                variant="success-outline"
                className="w-full md:w-auto md:min-w-[10.5rem] lg:w-full"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                Ponovi program
              </ButtonLink>
            ) : (
              <ButtonLink
                href={continueHref}
                className="w-full md:w-auto md:min-w-[10.5rem] lg:w-full"
              >
                <CirclePlay className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                Nadaljuj
              </ButtonLink>
            )}
            <a
              href={ownedOverviewHref}
              className="relative z-10 text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:text-center"
            >
              Poglej podrobnosti →
            </a>
          </div>
        </div>
      </article>
    </Card>
  );
}
