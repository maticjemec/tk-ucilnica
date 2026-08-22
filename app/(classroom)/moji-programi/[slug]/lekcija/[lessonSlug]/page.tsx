import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LessonPlayerClient } from "@/components/lesson-player/LessonPlayerClient";
import {
  getEntitlementForProgram,
  requireProgramEntitlement,
} from "@/lib/auth/access";
import { getOwnedLesson } from "@/lib/content/owned-program";
import {
  applySignedLessonMedia,
  getSignedLessonAudioUrl,
  getSignedLessonWorksheetUrl,
} from "@/lib/media/server";
import { canOpenLesson, formatLessonHeading } from "@/lib/owned-program/access";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { markLessonOpened } from "@/lib/progress/mutations";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import { getProgramWithCurriculum } from "@/lib/programs";

type OwnedLessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export async function generateMetadata({
  params,
}: OwnedLessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const bundle = await getProgramWithCurriculum(slug);
  const lesson = bundle
    ? getOwnedLesson(bundle.program, lessonSlug)
    : undefined;

  if (!bundle || !lesson) {
    return { title: "Lekcija" };
  }

  return {
    title: formatLessonHeading(lesson),
    description: lesson.description,
  };
}

export default async function OwnedLessonPage({ params }: OwnedLessonPageProps) {
  const { slug, lessonSlug } = await params;
  const access = await requireProgramEntitlement(slug);
  const entitlement = getEntitlementForProgram(access, slug);
  const now = new Date();
  const bundle = await getProgramWithCurriculum(slug);
  const program = bundle?.program;
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    notFound();
  }

  const rows = await getProgramLessonProgress(slug);
  const progress = buildProgramProgressView(program, rows, {
    entitlement,
    now,
  });

  if (!canOpenLesson(program, lesson, progress.completedIds, { entitlement, now })) {
    const fallback =
      progress.continueAvailable && progress.continueLesson?.slug !== lessonSlug
        ? progress.continueHref
        : getOwnedProgramOverviewPath(slug);
    redirect(fallback);
  }

  await markLessonOpened(slug, lessonSlug);

  const [audioUrl, worksheetUrl] = await Promise.all([
    getSignedLessonAudioUrl(slug, lessonSlug),
    getSignedLessonWorksheetUrl(slug, lessonSlug),
  ]);
  const playableLesson = applySignedLessonMedia(lesson, {
    audioUrl,
    worksheetUrl,
  });

  return (
    <LessonPlayerClient
      key={playableLesson.id}
      program={program}
      lesson={playableLesson}
      completedLessonIds={[...progress.completedIds]}
      entitlement={entitlement}
    />
  );
}
