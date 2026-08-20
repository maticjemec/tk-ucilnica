import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonBreadcrumb } from "@/components/lesson-player/LessonBreadcrumb";
import { OwnedBenefits } from "@/components/owned-overview/OwnedBenefits";
import { OwnedContinueCard } from "@/components/owned-overview/OwnedContinueCard";
import { OwnedCurriculum } from "@/components/owned-overview/OwnedCurriculum";
import { OwnedMaterials } from "@/components/owned-overview/OwnedMaterials";
import { OwnedProgramHero } from "@/components/owned-overview/OwnedProgramHero";
import { OwnedProgramHighlights } from "@/components/owned-overview/OwnedProgramHighlights";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { requireProgramEntitlement } from "@/lib/auth/access";
import {
  getOwnedProgramBySlug,
  getOwnedProgramStaticParams,
} from "@/lib/content/owned-program";
import { getOwnedOverviewModel } from "@/lib/owned-program/overview";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import { applyProgramIdentity, getProgramBySlug } from "@/lib/programs";

type OwnedProgramOverviewPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getOwnedProgramStaticParams();
}

export async function generateMetadata({
  params,
}: OwnedProgramOverviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const identity = await getProgramBySlug(slug);

  if (!identity) {
    return { title: "Moj program" };
  }

  return {
    title: identity.subtitle,
    description: identity.shortDescription,
  };
}

export default async function OwnedProgramOverviewPage({
  params,
}: OwnedProgramOverviewPageProps) {
  const { slug } = await params;
  await requireProgramEntitlement(slug);
  const identity = await getProgramBySlug(slug);
  const localProgram = getOwnedProgramBySlug(slug);

  if (!identity || !localProgram) {
    notFound();
  }

  const program = applyProgramIdentity(localProgram, identity);
  const rows = await getProgramLessonProgress(slug);
  const progress = buildProgramProgressView(program, rows);

  if (!progress) {
    notFound();
  }

  const model = getOwnedOverviewModel(program, progress, identity);

  return (
    <>
      <LessonBreadcrumb
        items={[
          { label: "Moji programi", href: "/moji-programi" },
          { label: program.label },
        ]}
      />

      <OwnedProgramHero model={model} />

      <div className="mt-5 grid grid-cols-1 gap-5 lg:mt-6 lg:grid-cols-[minmax(0,1fr)_21.5rem] lg:items-stretch lg:gap-6">
        <OwnedContinueCard model={model} />
        <OwnedProgramHighlights highlights={model.highlights} />
      </div>

      <div className="mt-5 lg:mt-6">
        <OwnedCurriculum
          sections={program.sections}
          lessons={model.lessons}
          sectionProgress={model.sectionProgress}
          currentLessonSlug={model.currentLesson.slug}
        />
      </div>

      <div className="mt-8 lg:mt-9">
        <OwnedMaterials
          featured={model.materials.featured}
          extra={model.materials.extra}
          total={model.materials.total}
        />
      </div>

      <div className="mt-5 lg:mt-6">
        <OwnedBenefits benefits={model.benefits} />
      </div>

      <SupportCard />
    </>
  );
}
