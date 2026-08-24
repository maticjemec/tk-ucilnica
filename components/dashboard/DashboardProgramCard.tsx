import type { DashboardProgram } from "@/types/dashboard";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Card } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import Link from "next/link";

type DashboardProgramCardProps = {
  program: DashboardProgram;
  variant: "progress" | "catalog";
};

export function DashboardProgramCard({
  program,
  variant,
}: DashboardProgramCardProps) {
  return (
    <Card padding="none" className="flex h-full flex-col overflow-hidden">
      <div className="relative">
        <CoverMedia
          alt={program.imageAlt ?? program.label}
          imageSrc={program.imageSrc}
          sizes="(min-width: 1440px) 18vw, (min-width: 768px) 45vw, 100vw"
          className="relative aspect-[4/3] w-full"
        >
          <ProgramPlaceholder visual={program.visual} />
        </CoverMedia>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
        <p
          className="program-title pointer-events-none absolute inset-x-3.5 bottom-3.5 text-[0.92rem] text-white drop-shadow-[0_1px_10px_rgba(28,25,22,0.45)]"
          aria-hidden
        >
          {program.title}
        </p>
      </div>

      {variant === "progress" ? (
        <Link
          href={getOwnedProgramOverviewPath(program.slug)}
          className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <h3 className="text-sm leading-snug font-normal text-foreground">
            {program.label}
          </h3>
          <div className="mt-auto flex items-center gap-2.5 pt-3">
            <Progress
              value={program.progress}
              label={`Napredek: ${program.label}`}
              className="h-1.5 flex-1"
            />
            <span className="w-9 shrink-0 text-right text-sm text-muted tabular-nums">
              {program.progress}%
            </span>
          </div>
        </Link>
      ) : (
        <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
          <h3 className="text-sm leading-snug font-normal text-foreground">
            {program.label}
          </h3>
          <p className="mt-1.5 text-[0.8rem] leading-[1.55] text-muted">
            {program.description}
          </p>
          <div className="mt-auto pt-3.5">
            <ButtonLink
              href={`/programi/${program.slug}`}
              variant="outline"
              className="w-full"
            >
              Ogled programa
            </ButtonLink>
          </div>
        </div>
      )}
    </Card>
  );
}
