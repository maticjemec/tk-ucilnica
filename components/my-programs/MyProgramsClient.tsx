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
  const visible = filterPurchasedPrograms(programs, filter);

  return (
    <section>
      <ProgramTabs value={filter} onChange={setFilter} />

      <div
        id="moji-programi-panel"
        role="tabpanel"
        aria-labelledby={`moji-programi-tab-${filter}`}
        className="mt-6"
      >
        {visible.length === 0 ? (
          <ProgramsEmptyState />
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
