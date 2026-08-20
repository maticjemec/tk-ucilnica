import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LessonPlayerClient } from "@/components/lesson-player/LessonPlayerClient";
import { requireProgramEntitlement } from "@/lib/auth/access";
import {
  getOwnedLesson,
  getOwnedLessonStaticParams,
  getOwnedProgramBySlug,
} from "@/lib/content/owned-program";
import { canOpenLesson, formatLessonHeading } from "@/lib/owned-program/access";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { buildProgramProgressView } from "@/lib/progress/helpers";
import { markLessonOpened } from "@/lib/progress/mutations";
import { getProgramLessonProgress } from "@/lib/progress/queries";

type OwnedLessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export function generateStaticParams() {
  return getOwnedLessonStaticParams();
}

export async function generateMetadata({
  params,
}: OwnedLessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const program = getOwnedProgramBySlug(slug);
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    return { title: "Lekcija" };
  }

  return {
    title: formatLessonHeading(lesson),
    description: lesson.description,
  };
}

export default async function OwnedLessonPage({ params }: OwnedLessonPageProps) {
  const { slug, lessonSlug } = await params;
  await requireProgramEntitlement(slug);
  const program = getOwnedProgramBySlug(slug);
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    notFound();
  }

  const rows = await getProgramLessonProgress(slug);
  const progress = buildProgramProgressView(program, rows);

  if (!progress || !canOpenLesson(program, lesson, progress.completedIds)) {
    redirect(progress?.continueHref ?? getOwnedProgramOverviewPath(slug));
  }

  await markLessonOpened(slug, lessonSlug);

  return (
    <LessonPlayerClient
      key={lesson.id}
      program={program}
      lesson={lesson}
      completedLessonIds={[...progress.completedIds]}
    />
  );
}
