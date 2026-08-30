import type { DashboardProgram } from "@/types/dashboard";
import { DashboardProgramCard } from "@/components/dashboard/DashboardProgramCard";

type ProgramGridProps = {
  programs: DashboardProgram[];
  variant: "progress" | "catalog";
};

export function ProgramGrid({ programs, variant }: ProgramGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {programs.map((program) => (
        <li key={program.slug} className="min-w-0">
          <DashboardProgramCard program={program} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
