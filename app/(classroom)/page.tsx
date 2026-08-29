import type { Metadata } from "next";
import { ContinueLessonCard } from "@/components/dashboard/ContinueLessonCard";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ProgramGrid } from "@/components/dashboard/ProgramGrid";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { ProgramsEmptyState } from "@/components/my-programs/ProgramsEmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryRecovery } from "@/components/ui/QueryRecovery";
import {
  areEntitlementsReadable,
  getOwnedProgramSlugs,
  requireAuthenticatedUser,
} from "@/lib/auth/access";
import {
  dashboardHero,
  getBestOwnedContinueLesson,
  getDashboardProgressSummary,
} from "@/lib/content/dashboard";
import { getOwnedProgressBySlug } from "@/lib/progress/owned";
import { getPublishedProgramsResult, toDashboardProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Pregled",
};

export default async function PregledPage() {
  const access = await requireAuthenticatedUser("/");

  if (!areEntitlementsReadable(access)) {
    return (
      <>
        <PageHeader
          title={`Dobrodošel nazaj, ${access.user.firstName} 👋`}
          subtitle="Nadaljuj svojo pot rasti in spremembe."
        />
        <QueryRecovery
          title="Pregleda trenutno ni mogoče naložiti."
          description="Tvojih programov in napredka trenutno ni mogoče prikazati. Poskusi znova čez trenutek."
        />
      </>
    );
  }

  const ownedSlugs = getOwnedProgramSlugs(access);
  const [progressBySlug, published] = await Promise.all([
    getOwnedProgressBySlug(ownedSlugs),
    getPublishedProgramsResult(),
  ]);

  if (!published.ok) {
    return (
      <>
        <PageHeader
          title={`Dobrodošel nazaj, ${access.user.firstName} 👋`}
          subtitle="Nadaljuj svojo pot rasti in spremembe."
        />
        <QueryRecovery
          title="Pregleda trenutno ni mogoče naložiti."
          description="Tvojih programov in napredka trenutno ni mogoče prikazati. Poskusi znova čez trenutek."
        />
      </>
    );
  }

  const owned = new Set(ownedSlugs);
  const percentBySlug = new Map(
    [...progressBySlug.entries()].map(([slug, progress]) => [
      slug,
      progress.progressPercent,
    ]),
  );
  const ownedPrograms = published.programs
    .filter((program) => owned.has(program.slug))
    .map((program) =>
      toDashboardProgram(program, percentBySlug.get(program.slug) ?? 0),
    );
  const catalogPrograms = published.programs.map((program) =>
    toDashboardProgram(program),
  );
  const ownedContinueLesson = getBestOwnedContinueLesson(
    ownedPrograms,
    progressBySlug,
  );
  const dashboardProgress = getDashboardProgressSummary(
    ownedPrograms.map((program) => program.progress),
  );

  return (
    <>
      <PageHeader
        title={`Dobrodošel nazaj, ${access.user.firstName} 👋`}
        subtitle="Nadaljuj svojo pot rasti in spremembe."
      />

      <div className="grid grid-cols-1 gap-8 min-[1440px]:grid-cols-[minmax(0,1fr)_17.75rem] min-[1440px]:items-start min-[1440px]:gap-6">
        <div className="min-w-0">
          <DashboardHero content={dashboardHero} />

          <section className="mt-8">
            <SectionHeading
              title="Moji programi"
              action={{ href: "/moji-programi", label: "Prikaži vse →" }}
            />
            {ownedPrograms.length === 0 ? (
              <ProgramsEmptyState variant="none" />
            ) : (
              <ProgramGrid
                programs={ownedPrograms}
                variant="progress"
                showPeekControl
              />
            )}
          </section>

          <section className="mt-10 pb-6 min-[1440px]:mt-11 min-[1440px]:pb-8">
            <SectionHeading title="Vsi programi" spacing="roomy" />
            <ProgramGrid programs={catalogPrograms} variant="catalog" />
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <ProgressOverview
            progress={dashboardProgress}
            detailsHref={ownedPrograms.length === 0 ? "/programi" : "/moji-programi"}
            detailsLabel={
              ownedPrograms.length === 0
                ? "Razišči programe"
                : "Ogled podrobnosti"
            }
          />
          {ownedContinueLesson ? (
            <ContinueLessonCard lesson={ownedContinueLesson} />
          ) : null}
        </aside>
      </div>
    </>
  );
}
