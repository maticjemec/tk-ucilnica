import { BarChart3, BookOpen, Clock } from "lucide-react";
import { CoverMedia } from "@/components/dashboard/CoverMedia";
import { ProgramPlaceholder } from "@/components/dashboard/visuals";
import { cn } from "@/lib/cn";
import { formatCatalogLessons } from "@/lib/content/catalog";
import type { ProgramCategory } from "@/types/catalog";
import type { ProgramDetail } from "@/types/program-detail";

const categoryBadgeClass: Record<ProgramCategory, string> = {
  anxiety: "bg-[#2f6f6f]/82",
  confidence: "bg-[#a45c4e]/85",
  growth: "bg-[#c47a3a]/85",
  "self-hypnosis": "bg-[#1c4a4a]/85",
  sleep: "bg-[#5c4a78]/85",
  relaxation: "bg-[#3a5a8c]/85",
  journal: "bg-[#4a7a4e]/85",
};

type ProgramDetailHeroProps = {
  program: ProgramDetail;
  className?: string;
};

export function ProgramDetailHero({
  program,
  className,
}: ProgramDetailHeroProps) {
  return (
    <div className={cn("min-w-0 overflow-hidden bg-surface", className)}>
      <div className="relative">
        <CoverMedia
          alt={program.imageAlt ?? program.title}
          imageSrc={program.imageSrc}
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[16/9] w-full"
        >
          <ProgramPlaceholder visual={program.visual} variant="hero" />
        </CoverMedia>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/22 via-transparent to-black/8" />

        <span
          className={cn(
            "absolute bottom-3 left-3 rounded-sm px-2 py-0.5 text-[0.62rem] font-medium tracking-[0.08em] text-white uppercase sm:bottom-3.5 sm:left-3.5",
            categoryBadgeClass[program.category],
          )}
        >
          {program.categoryLabel}
        </span>

      </div>

      <div className="px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6 lg:px-8 lg:pt-7 lg:pb-6">
        <h1 className="program-title text-[1.35rem] leading-[1.28] sm:text-[1.7rem] lg:text-[1.85rem]">
          {program.title}
        </h1>
        <p className="mt-2.5 max-w-[40rem] text-[0.925rem] leading-relaxed text-muted">
          {program.shortDescription}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
            {formatCatalogLessons(program.lessons)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
            {program.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 shrink-0" strokeWidth={1.6} aria-hidden />
            {program.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}
