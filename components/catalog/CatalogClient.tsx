"use client";

import { useMemo, useState } from "react";
import { CatalogProgramCard } from "@/components/catalog/CatalogProgramCard";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { CategoryPills } from "@/components/catalog/CategoryPills";
import { PageHeader } from "@/components/ui/PageHeader";
import { getVisibleCatalogPrograms } from "@/lib/content/catalog";
import type {
  CatalogFilterId,
  CatalogProgram,
  CatalogSortId,
  CatalogView,
} from "@/types/catalog";

type CatalogClientProps = {
  programs: CatalogProgram[];
  ownedSlugs?: string[];
};

export function CatalogClient({
  programs,
  ownedSlugs = [],
}: CatalogClientProps) {
  const [filter, setFilter] = useState<CatalogFilterId>("all");
  const [sort, setSort] = useState<CatalogSortId>("popularity");
  const [view, setView] = useState<CatalogView>("grid");
  const visible = useMemo(
    () => getVisibleCatalogPrograms(programs, filter, sort),
    [programs, filter, sort],
  );

  return (
    <>
      <PageHeader
        title="Vsi programi"
        subtitle="Izberi program, ki te danes najbolj nagovarja."
        actions={
          <CatalogToolbar
            sort={sort}
            view={view}
            onSortChange={setSort}
            onViewChange={setView}
          />
        }
      />

      <CategoryPills value={filter} onChange={setFilter} />

      <section className="mt-6" aria-label="Katalog programov">
        {visible.length === 0 ? (
          <p className="rounded-md border border-border bg-surface px-6 py-12 text-center text-sm text-muted shadow-[var(--shadow-card)]">
            {programs.length === 0
              ? "Trenutno ni objavljenih programov."
              : "V tej kategoriji trenutno ni programov."}
          </p>
        ) : (
          <ul
            className={
              view === "grid"
                ? "grid grid-cols-1 items-stretch justify-items-start gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4"
                : "flex flex-col gap-4"
            }
          >
            {visible.map((program) => (
              <li key={program.id} className="min-w-0 w-full">
                <CatalogProgramCard
                  program={program}
                  variant={view}
                  owned={ownedSlugs.includes(program.slug)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
