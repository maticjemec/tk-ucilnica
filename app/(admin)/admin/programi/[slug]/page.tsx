import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { SectionManager } from "@/components/admin/SectionManager";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminProgramDetail } from "@/lib/admin/queries";

type AdminProgramPageProps = {
  params: Promise<{ slug: string }>;
};

const CONTENT_LABELS: Record<string, string> = {
  video: "Video",
  audio: "Avdio",
  text: "Besedilo",
  worksheet: "PDF",
  mixed: "Mešano",
};

export default async function AdminProgramDetailPage({
  params,
}: AdminProgramPageProps) {
  const { slug } = await params;
  const detail = await getAdminProgramDetail(slug);

  if (!detail) {
    notFound();
  }

  const nextSectionOrder =
    detail.sections.reduce((max, section) => Math.max(max, section.section_order), 0) +
    1;

  return (
    <>
      <PageHeader
        title={detail.program.title}
        subtitle={detail.program.slug}
        actions={
          <Link href="/admin/programi" className="text-sm text-accent hover:underline">
            Vsi programi
          </Link>
        }
      />

      <p className="mb-6 text-sm text-muted">
        Katalog: {detail.program.lesson_count} lekcij · kurikulum:{" "}
        {detail.lessonPublished} objavljenih / {detail.lessonTotal} skupaj
      </p>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-foreground">Program</h2>
        <ProgramForm program={detail.program} />
      </section>

      <section className="mb-10">
        <h2 className="mb-4 font-serif text-xl text-foreground">Razdelki</h2>
        <SectionManager
          programSlug={detail.program.slug}
          sections={detail.sections}
          nextOrder={nextSectionOrder}
        />
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-xl text-foreground">Lekcije</h2>
          <Link
            href={`/admin/programi/${detail.program.slug}/lekcije/nova`}
            className="inline-flex h-9 items-center rounded-sm bg-accent px-3 text-sm font-medium text-accent-foreground"
          >
            Nova lekcija
          </Link>
        </div>

        <Card padding="none" className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-[0.72rem] tracking-[0.08em] text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Naslov</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Razdelek</th>
                <th className="px-4 py-3">Vrstni red</th>
                <th className="px-4 py-3">Trajanje</th>
                <th className="px-4 py-3">Vrsta</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Odklep</th>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Zvok</th>
                <th className="px-4 py-3">PDF</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {detail.lessons.map((lesson) => (
                <tr key={lesson.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{lesson.title}</td>
                  <td className="px-4 py-3 text-muted">{lesson.slug}</td>
                  <td className="px-4 py-3">{lesson.sectionTitle ?? "—"}</td>
                  <td className="px-4 py-3">{lesson.lesson_order}</td>
                  <td className="px-4 py-3">
                    {lesson.duration_minutes ? `${lesson.duration_minutes} min` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {CONTENT_LABELS[lesson.content_type] ?? lesson.content_type}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={lesson.is_published ? "success" : "muted"}>
                      {lesson.is_published ? "Da" : "Ne"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{lesson.unlock_mode ?? "—"}</td>
                  <td className="px-4 py-3">{lesson.video_status ?? "—"}</td>
                  <td className="px-4 py-3">{lesson.audio_path ? "Da" : "Ne"}</td>
                  <td className="px-4 py-3">{lesson.worksheet_path ? "Da" : "Ne"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/programi/${detail.program.slug}/lekcije/${lesson.slug}`}
                      className="text-accent hover:underline"
                    >
                      Uredi
                    </Link>
                  </td>
                </tr>
              ))}
              {detail.lessons.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-muted">
                    Ni lekcij.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </Card>
      </section>
    </>
  );
}
