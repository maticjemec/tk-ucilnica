import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminPrograms } from "@/lib/admin/queries";
import { centsToEur } from "@/lib/admin/validation";

export default async function AdminProgramsPage() {
  const programs = await getAdminPrograms();

  return (
    <>
      <PageHeader
        title="Programi"
        subtitle="Vsi programi, vključno z neobjavljenimi."
        actions={
          <Link
            href="/admin/programi/nov"
            className="inline-flex h-10 items-center rounded-sm bg-accent px-4 text-sm font-medium text-accent-foreground"
          >
            Nov program
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-md border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-border text-[0.72rem] tracking-[0.08em] text-muted uppercase">
            <tr>
              <th className="px-4 py-3">Naslov</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Kategorija</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Lekcije</th>
              <th className="px-4 py-3">Vrstni red</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  {program.title}
                </td>
                <td className="px-4 py-3 text-muted">{program.slug}</td>
                <td className="px-4 py-3">{program.category_label}</td>
                <td className="px-4 py-3">
                  {centsToEur(program.price_cents)} {program.currency}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={program.is_published ? "success" : "muted"}>
                    {program.is_published ? "Objavljeno" : "Osnutek"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {program.lessonPublished}/{program.lessonTotal}
                </td>
                <td className="px-4 py-3">{program.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/programi/${program.slug}`}
                    className="text-accent hover:underline"
                  >
                    Uredi
                  </Link>
                </td>
              </tr>
            ))}
            {programs.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">
                  Ni programov.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
