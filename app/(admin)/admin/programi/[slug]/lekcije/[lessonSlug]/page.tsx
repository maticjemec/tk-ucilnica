import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLessonEditor } from "@/components/admin/AdminLessonEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminLesson } from "@/lib/admin/queries";

type AdminLessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
};

export default async function AdminLessonPage({ params }: AdminLessonPageProps) {
  const { slug, lessonSlug } = await params;
  const detail = await getAdminLesson(slug, lessonSlug);

  if (!detail) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={detail.lesson.title}
        subtitle={`${detail.program.title} · ${detail.lesson.slug}`}
        actions={
          <Link
            href={`/admin/programi/${detail.program.slug}`}
            className="text-sm text-accent hover:underline"
          >
            Nazaj na program
          </Link>
        }
      />

      <AdminLessonEditor
        programSlug={detail.program.slug}
        lesson={detail.lesson}
        sections={detail.sections}
      />
    </>
  );
}
