"use client";

import { useState } from "react";
import { ProgramAuthorCard } from "@/components/program-detail/ProgramAuthorCard";
import { ProgramBenefits } from "@/components/program-detail/ProgramBenefits";
import { ProgramBreadcrumb } from "@/components/program-detail/ProgramBreadcrumb";
import { ProgramCurriculum } from "@/components/program-detail/ProgramCurriculum";
import { ProgramDetailHero } from "@/components/program-detail/ProgramDetailHero";
import { ProgramIncludesCard } from "@/components/program-detail/ProgramIncludesCard";
import { ProgramSupportCard } from "@/components/program-detail/ProgramSupportCard";
import { PurchaseCard } from "@/components/program-detail/PurchaseCard";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { cn } from "@/lib/cn";
import type { ProgramDetail } from "@/types/program-detail";

type ProgramDetailClientProps = {
  program: ProgramDetail;
  isAuthenticated: boolean;
};

export function ProgramDetailClient({
  program,
  isAuthenticated,
}: ProgramDetailClientProps) {
  const [isFavorite, setIsFavorite] = useState(program.isFavorite);

  return (
    <>
      <ProgramBreadcrumb label={program.breadcrumbLabel} />

      <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-[minmax(0,1fr)_21.25rem] lg:items-start lg:gap-6">
        <div className="contents min-w-0 md:flex md:flex-col md:gap-6">
          <article
            className={cn(
              "contents min-w-0 overflow-hidden",
              "md:flex md:flex-col md:rounded-md md:border md:border-border md:bg-surface md:shadow-[var(--shadow-card)]",
            )}
          >
            <ProgramDetailHero
              program={program}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite((current) => !current)}
              className="order-1 rounded-md border border-border shadow-[var(--shadow-card)] md:order-none md:rounded-none md:border-0 md:shadow-none"
            />
            <ProgramBenefits
              description={program.longDescription}
              benefits={program.benefits}
              className="order-3 rounded-md border border-border shadow-[var(--shadow-card)] md:order-none md:rounded-none md:border-0 md:shadow-none"
            />
          </article>

          <ProgramCurriculum
            items={program.curriculum}
            accessState={program.accessState}
            className="order-4 md:order-none"
          />
        </div>

        <aside className="contents md:flex md:flex-col md:gap-3.5 lg:sticky lg:top-6">
          <PurchaseCard
            program={program}
            isAuthenticated={isAuthenticated}
            className="order-2 md:order-none"
          />
          <ProgramIncludesCard
            items={program.includes}
            className="order-5 md:order-none"
          />
          <ProgramSupportCard className="order-6 md:order-none" />
          <ProgramAuthorCard
            author={program.author}
            className="order-7 md:order-none"
          />
        </aside>
      </div>

      <div className="pt-1">
        <SupportCard
          title="Potrebujete pomoč?"
          description="Če imate vprašanja ali potrebujete podporo, smo tukaj za vas."
        />
      </div>
    </>
  );
}
