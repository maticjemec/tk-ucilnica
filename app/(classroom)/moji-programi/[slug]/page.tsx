import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonBreadcrumb } from "@/components/lesson-player/LessonBreadcrumb";
import { OwnedBenefits } from "@/components/owned-overview/OwnedBenefits";
import { OwnedContinueCard } from "@/components/owned-overview/OwnedContinueCard";
import { OwnedCurriculum } from "@/components/owned-overview/OwnedCurriculum";
import { OwnedCurriculumUnavailable } from "@/components/owned-overview/OwnedCurriculumUnavailable";
import { OwnedMaterials } from "@/components/owned-overview/OwnedMaterials";
import { OwnedProgramHero } from "@/components/owned-overview/OwnedProgramHero";
import { OwnedProgramHighlights } from "@/components/owned-overview/OwnedProgramHighlights";
import { OwnedProgramOnboarding } from "@/components/owned-overview/OwnedProgramOnboarding";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { QueryRecovery } from "@/components/ui/QueryRecovery";
import {
  getEntitlementForProgram,
  requireProgramEntitlement,
} from "@/lib/auth/access";
import { getOwnedOverviewModel } from "@/lib/owned-program/overview";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import { getProgramBySlug, getProgramWithCurriculumResult } from "@/lib/programs";

type OwnedProgramOverviewPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: OwnedProgramOverviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);

  if (!program) {
    return { title: "Moj program" };
  }

  return {
    title: program.subtitle,
    description: program.shortDescription,
  };
}

export default async function OwnedProgramOverviewPage({
  params,
}: OwnedProgramOverviewPageProps) {
  const { slug } = await params;
  const [access, lookup, rows] = await Promise.all([
    requireProgramEntitlement(slug),
    getProgramWithCurriculumResult(slug),
    getProgramLessonProgress(slug),
  ]);

  if (!lookup.ok) {
    return (
      <QueryRecovery
        title="Programa trenutno ni mogoče naložiti."
        description="Poskusi znova čez trenutek. Če se stran ne naloži, se vrni na Moje programe."
      />
    );
  }

  if (!lookup.bundle) {
    notFound();
  }

  const bundle = lookup.bundle;

  const entitlement = getEntitlementForProgram(access, slug);
  const now = new Date();
  const { identity, program } = bundle;
  const progress = buildProgramProgressView(program, rows, {
    entitlement,
    now,
  });
  const model = getOwnedOverviewModel(program, progress, identity, {
    entitlement,
    now,
  });

  return (
    <>
      <LessonBreadcrumb
        items={[
          { label: "Moji programi", href: "/moji-programi" },
          { label: program.label },
        ]}
      />

      <OwnedProgramHero model={model} />

      {model.isFirstTime ? (
        <div className="mt-5 lg:mt-6">
          <OwnedProgramOnboarding model={model} />
        </div>
      ) : model.hasCurriculum && (model.currentLesson || model.waitingLesson) ? (
        <div className="mt-5 grid grid-cols-1 gap-5 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_21.5rem] lg:items-stretch lg:gap-6">
          <OwnedContinueCard model={model} />
          <OwnedProgramHighlights highlights={model.highlights} />
        </div>
      ) : model.hasCurriculum ? (
        <div className="mt-5 lg:mt-6">
          <OwnedProgramHighlights highlights={model.highlights} />
        </div>
      ) : null}

      <div className="mt-5 lg:mt-6">
        {model.hasCurriculum ? (
          <OwnedCurriculum
            sections={program.sections}
            lessons={model.lessons}
            sectionProgress={model.sectionProgress}
            currentLessonSlug={model.focusLessonSlug}
          />
        ) : (
          <OwnedCurriculumUnavailable />
        )}
      </div>

      {model.materials.total > 0 ? (
        <div className="mt-8 lg:mt-9">
          <OwnedMaterials
            featured={model.materials.featured}
            extra={model.materials.extra}
            total={model.materials.total}
          />
        </div>
      ) : null}

      <div className="mt-5 lg:mt-6">
        <OwnedBenefits benefits={model.benefits} />
      </div>

      <SupportCard />
    </>
  );
}
