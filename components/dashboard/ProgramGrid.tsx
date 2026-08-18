import { ChevronRight } from "lucide-react";
import type { DashboardProgram } from "@/types/dashboard";
import { DashboardProgramCard } from "@/components/dashboard/DashboardProgramCard";

type ProgramGridProps = {
  programs: DashboardProgram[];
  variant: "progress" | "catalog";
  showPeekControl?: boolean;
};

export function ProgramGrid({
  programs,
  variant,
  showPeekControl = false,
}: ProgramGridProps) {
  return (
    <div className="relative">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {programs.map((program) => (
          <li key={program.slug} className="min-w-0">
            <DashboardProgramCard program={program} variant={variant} />
          </li>
        ))}
      </ul>

      {showPeekControl ? (
        <div
          className="pointer-events-none absolute top-[34%] right-0 z-10 hidden translate-x-1/2 xl:flex"
          aria-hidden
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-[var(--shadow-card)]">
            <ChevronRight className="h-4 w-4 text-foreground" strokeWidth={1.75} />
          </span>
        </div>
      ) : null}
    </div>
  );
}
