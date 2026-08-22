import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonForm } from "@/components/admin/LessonForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminProgramDetail } from "@/lib/admin/queries";

type NewLessonPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminNewLessonPage({ params }: NewLessonPageProps) {
  const { slug } = await params;
  const detail = await getAdminProgramDetail(slug);

  if (!detail) {
    notFound();
  }

  const nextOrder =
    detail.lessons.reduce((max, lesson) => Math.max(max, lesson.lesson_order), 0) + 1;

  return (
    <>
      <PageHeader
        title="Nova lekcija"
        subtitle={detail.program.title}
        actions={
          <Link
            href={`/admin/programi/${detail.program.slug}`}
            className="text-sm text-accent hover:underline"
          >
            Nazaj
          </Link>
        }
      />
      <LessonForm
        programSlug={detail.program.slug}
        sections={detail.sections}
        nextOrder={nextOrder}
      />
    </>
  );
}
