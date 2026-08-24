"use client";

import { useState } from "react";
import { ProgramTabs } from "@/components/my-programs/ProgramTabs";
import { ProgramsEmptyState } from "@/components/my-programs/ProgramsEmptyState";
import { PurchasedProgramCard } from "@/components/my-programs/PurchasedProgramCard";
import { filterPurchasedPrograms } from "@/lib/content/programs";
import type { ProgramFilter, PurchasedProgram } from "@/types/programs";

type MyProgramsClientProps = {
  programs: PurchasedProgram[];
};

export function MyProgramsClient({ programs }: MyProgramsClientProps) {
  const [filter, setFilter] = useState<ProgramFilter>("all");
  const hasOwned = programs.length > 0;
  const visible = filterPurchasedPrograms(programs, filter);

  return (
    <section>
      {hasOwned ? <ProgramTabs value={filter} onChange={setFilter} /> : null}

      <div
        id="moji-programi-panel"
        role="tabpanel"
        aria-labelledby={hasOwned ? `moji-programi-tab-${filter}` : undefined}
        className={hasOwned ? "mt-6" : undefined}
      >
        {!hasOwned ? (
          <ProgramsEmptyState variant="none" />
        ) : visible.length === 0 ? (
          <ProgramsEmptyState variant="filter" />
        ) : (
          <ul className="flex flex-col gap-4">
            {visible.map((program) => (
              <li key={program.slug}>
                <PurchasedProgramCard program={program} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
