import Link from "next/link";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAdminPrograms } from "@/lib/admin/queries";

export default async function AdminNewProgramPage() {
  const programs = await getAdminPrograms();
  const nextSortOrder =
    programs.reduce((max, program) => Math.max(max, program.sort_order), 0) + 1;

  return (
    <>
      <PageHeader
        title="Nov program"
        subtitle="Osnutek ostane skrit, dokler ga ne objaviš."
        actions={
          <Link href="/admin/programi" className="text-sm text-accent hover:underline">
            Nazaj
          </Link>
        }
      />
      <ProgramForm nextSortOrder={nextSortOrder} />
    </>
  );
}
