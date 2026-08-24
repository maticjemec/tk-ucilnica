import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { getOwnedProgramSlugs, getUserAccessContext } from "@/lib/auth/access";
import { getPublishedPrograms, toCatalogProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Vsi programi",
};

export default async function ProgramiPage() {
  const [access, published] = await Promise.all([
    getUserAccessContext(),
    getPublishedPrograms(),
  ]);
  const ownedSlugs = getOwnedProgramSlugs(access);
  const programs = published.map(toCatalogProgram);

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
