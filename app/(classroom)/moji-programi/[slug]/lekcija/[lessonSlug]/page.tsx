import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayerClient } from "@/components/lesson-player/LessonPlayerClient";
import {
  getOwnedLesson,
  getOwnedLessonStaticParams,
  getOwnedProgramBySlug,
} from "@/lib/content/owned-program";
import { formatLessonHeading } from "@/lib/owned-program/access";

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
  const program = getOwnedProgramBySlug(slug);
  const lesson = program ? getOwnedLesson(program, lessonSlug) : undefined;

  if (!program || !lesson) {
    notFound();
  }

  return <LessonPlayerClient program={program} lesson={lesson} />;
}
