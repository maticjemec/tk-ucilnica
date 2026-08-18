import Link from "next/link";
import { BookOpen, Clock, Heart } from "lucide-react";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import {
  formatCatalogLessons,
  formatCatalogPrice,
} from "@/lib/content/catalog";
import type { CatalogProgram, CatalogView, ProgramCategory } from "@/types/catalog";

const categoryBadgeClass: Record<ProgramCategory, string> = {
  anxiety: "bg-[#2f6f6f]/82",
  confidence: "bg-[#a45c4e]/85",
  growth: "bg-[#c47a3a]/85",
  "self-hypnosis": "bg-[#1c4a4a]/85",
  sleep: "bg-[#5c4a78]/85",
  relaxation: "bg-[#3a5a8c]/85",
  journal: "bg-[#4a7a4e]/85",
};

type CatalogProgramCardProps = {
  program: CatalogProgram;
  variant: CatalogView;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
};

export function CatalogProgramCard({
  program,
  variant,
  isFavorite,
  onToggleFavorite,
}: CatalogProgramCardProps) {
  const href = `/programi/${program.slug}`;
  const titleId = `catalog-title-${program.id}`;
  const list = variant === "list";

  return (
    <Card
      padding="none"
      className={cn(
        "relative h-full overflow-hidden transition-shadow",
        "hover:shadow-[0_1px_2px_rgba(28,25,22,0.05),0_14px_32px_rgba(28,25,22,0.06)]",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent",
      )}
    >
      <article
        aria-labelledby={titleId}
        className={cn(
          "flex h-full",
          list ? "flex-col md:flex-row md:items-stretch" : "flex-col",
        )}
      >
        <div
          className={cn(
            list
              ? "p-3.5 pb-0 md:w-[38%] md:shrink-0 md:self-stretch md:p-3.5 md:pr-2 lg:w-[28%] lg:p-4 lg:pr-2"
              : "",
          )}
        >
          <div
            className={cn(
              "relative z-20 pointer-events-none overflow-hidden",
              list && "h-full rounded-md",
            )}
          >
            <CoverMedia
              alt={program.imageAlt ?? program.title}
              imageSrc={program.imageSrc}
              sizes={
                list
                  ? "(min-width: 1024px) 28vw, (min-width: 768px) 38vw, 100vw"
                  : "(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
              }
              className={cn(
                "w-full",
                list
                  ? "aspect-[16/9] md:h-full md:min-h-[9.25rem] md:aspect-auto"
                  : "aspect-[16/9]",
              )}
            >
              <ProgramPlaceholder visual={program.visual} />
            </CoverMedia>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />

            <span
              className={cn(
                "absolute bottom-2.5 left-2.5 rounded-sm px-2 py-0.5 text-[0.62rem] font-medium tracking-[0.08em] text-white uppercase",
                categoryBadgeClass[program.category],
              )}
            >
              {program.categoryLabel}
            </span>

            <button
              type="button"
              aria-label={
                isFavorite
                  ? "Odstrani iz priljubljenih"
                  : "Dodaj med priljubljene"
              }
              aria-pressed={isFavorite}
              className={cn(
                "pointer-events-auto absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-white",
                "drop-shadow-[0_1px_8px_rgba(28,25,22,0.35)] transition-colors",
                "hover:bg-black/20",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onToggleFavorite(program.id);
              }}
            >
              <Heart
                className="h-4 w-4"
                strokeWidth={1.7}
                fill={isFavorite ? "currentColor" : "none"}
                aria-hidden
              />
            </button>
          </div>
        </div>

        {list ? (
          <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col justify-center px-5 pt-3.5 pb-3 md:px-5 md:py-4 lg:px-6 lg:py-4">
              <h3
                id={titleId}
                className="program-title text-[0.98rem] lg:text-[1.05rem]"
              >
                {program.title}
              </h3>
              <p className="mt-1.5 max-w-[36rem] text-sm leading-relaxed text-muted">
                {program.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                  {formatCatalogLessons(program.lessons)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                  {program.duration}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-1 px-5 pb-4 md:px-5 md:pb-4 lg:w-[10.5rem] lg:shrink-0 lg:items-end lg:px-4 lg:py-4">
              <span className="text-base font-semibold text-accent tabular-nums">
                {formatCatalogPrice(program.price)}
              </span>
              <span className="text-sm text-foreground/80">
                Ogled programa →
              </span>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col px-3.5 pt-2.5 pb-3">
            <h3
              id={titleId}
              className="program-title line-clamp-2 text-[0.92rem]"
            >
              {program.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-[1.5] text-muted">
              {program.description}
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-2.5 text-[0.8125rem] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                {formatCatalogLessons(program.lessons)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.6} aria-hidden />
                {program.duration}
              </span>
              <span className="ml-auto font-semibold text-accent tabular-nums">
                {formatCatalogPrice(program.price)}
              </span>
            </div>
          </div>
        )}
      </article>

      <Link
        href={href}
        className="absolute inset-0 z-10"
        aria-labelledby={titleId}
      >
        <span className="sr-only">{program.title}</span>
      </Link>
    </Card>
  );
}
