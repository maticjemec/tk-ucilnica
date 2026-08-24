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
  getSignedLessonVideoPlayback,
  getSignedLessonWorksheetUrl,
} from "@/lib/media/server";
import { canOpenLesson, formatLessonHeading } from "@/lib/owned-program/access";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { markLessonOpened } from "@/lib/progress/mutations";
import { getProgramLessonProgress } from "@/lib/progress/queries";
import { getProgramWithCurriculum } from "@/lib/programs";
import { isNextRouterPrefetch } from "@/lib/http/prefetch";

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
  const [access, bundle, rows] = await Promise.all([
    requireProgramEntitlement(slug),
    getProgramWithCurriculum(slug),
    getProgramLessonProgress(slug),
  ]);
  const entitlement = getEntitlementForProgram(access, slug);
  const now = new Date();
  const program = bundle?.program;
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    notFound();
  }

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

  const contentType = lesson.contentType ?? "video";
  const signAudio = contentType === "audio" || contentType === "mixed";
  const signVideo = contentType === "video" || contentType === "mixed";
  const signWorksheet =
    contentType === "worksheet" ||
    contentType === "mixed" ||
    Boolean(lesson.worksheetSrc);

  const prefetch = await isNextRouterPrefetch();
  const [audioUrl, worksheetUrl, video] = await Promise.all([
    signAudio ? getSignedLessonAudioUrl(slug, lessonSlug) : Promise.resolve(null),
    signWorksheet
      ? getSignedLessonWorksheetUrl(slug, lessonSlug)
      : Promise.resolve(null),
    signVideo
      ? getSignedLessonVideoPlayback(slug, lessonSlug)
      : Promise.resolve(null),
    prefetch ? Promise.resolve(null) : markLessonOpened(slug, lessonSlug),
  ]);

  const playableLesson = applySignedLessonMedia(lesson, {
    audioUrl,
    worksheetUrl,
    video,
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
