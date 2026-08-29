import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryRecovery } from "@/components/ui/QueryRecovery";
import { getOwnedProgramSlugs, getUserAccessContext } from "@/lib/auth/access";
import { getPublishedProgramsResult, toCatalogProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Vsi programi",
};

export default async function ProgramiPage() {
  const [access, published] = await Promise.all([
    getUserAccessContext(),
    getPublishedProgramsResult(),
  ]);

  if (!published.ok) {
    return (
      <>
        <PageHeader
          title="Vsi programi"
          subtitle="Izberi program, ki te danes najbolj nagovarja."
        />
        <QueryRecovery
          title="Programov trenutno ni mogoče naložiti."
          description="Poskusi znova čez trenutek. Če se stran ne naloži, se vrni kasneje."
        />
      </>
    );
  }

  const ownedSlugs = getOwnedProgramSlugs(access);
  const programs = published.programs.map(toCatalogProgram);

  return (
    <>
      <CatalogClient programs={programs} ownedSlugs={ownedSlugs} />
      <div className="pt-2">
        <SupportCard
          title="Ne najdeš programa zase?"
          description="Piši nam in pomagali ti bomo izbrati pravega zate."
        />
      </div>
    </>
  );
}
