import type { Metadata } from "next";
import { ContinueLessonCard } from "@/components/dashboard/ContinueLessonCard";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { ProgramGrid } from "@/components/dashboard/ProgramGrid";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { SectionHeading } from "@/components/dashboard/SectionHeading";
import { UpcomingLessonsCard } from "@/components/dashboard/UpcomingLessonsCard";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getOwnedProgramSlugs,
  requireAuthenticatedUser,
} from "@/lib/auth/access";
import {
  dashboardHero,
  getDashboardProgressSummary,
  getOwnedContinueLesson,
  getOwnedUpcomingLessons,
} from "@/lib/content/dashboard";
import { getOwnedProgressBySlug } from "@/lib/progress/owned";
import { getPublishedPrograms, toDashboardProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Pregled",
};

export default async function PregledPage() {
  const access = await requireAuthenticatedUser("/");
  const ownedSlugs = getOwnedProgramSlugs(access);
  const owned = new Set(ownedSlugs);
  const [progressBySlug, published] = await Promise.all([
    getOwnedProgressBySlug(ownedSlugs),
    getPublishedPrograms(),
  ]);
  const percentBySlug = new Map(
    [...progressBySlug.entries()].map(([slug, progress]) => [
      slug,
      progress.progressPercent,
    ]),
  );
  const ownedPrograms = published
    .filter((program) => owned.has(program.slug))
    .map((program) =>
      toDashboardProgram(program, percentBySlug.get(program.slug) ?? 0),
    );
  const catalogPrograms = published.map((program) =>
    toDashboardProgram(program),
  );
  const ownedContinueLesson = getOwnedContinueLesson(ownedSlugs);
  const ownedUpcomingLessons = getOwnedUpcomingLessons(ownedSlugs);
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
            <ProgramGrid
              programs={ownedPrograms}
              variant="progress"
              showPeekControl={ownedPrograms.length > 0}
            />
          </section>

          <section className="mt-10 pb-6 min-[1440px]:mt-11 min-[1440px]:pb-8">
            <SectionHeading title="Vsi programi" spacing="roomy" />
            <ProgramGrid programs={catalogPrograms} variant="catalog" />
          </section>
        </div>

        <aside className="flex min-w-0 flex-col gap-4">
          <ProgressOverview progress={dashboardProgress} />
          {ownedContinueLesson ? (
            <ContinueLessonCard lesson={ownedContinueLesson} />
          ) : null}
          {ownedUpcomingLessons.length > 0 ? (
            <UpcomingLessonsCard lessons={ownedUpcomingLessons} />
          ) : null}
        </aside>
      </div>
    </>
  );
}
