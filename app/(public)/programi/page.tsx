import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { getOwnedProgramSlugs, getUserAccessContext } from "@/lib/auth/access";
import { catalogPrograms } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Vsi programi",
};

export default async function ProgramiPage() {
  const access = await getUserAccessContext();
  const ownedSlugs = getOwnedProgramSlugs(access);

  return (
    <>
      <CatalogClient programs={catalogPrograms} ownedSlugs={ownedSlugs} />
      <div className="pt-2">
        <SupportCard
          title="Ne najdeš programa zase?"
          description="Piši nam in pomagali ti bomo izbrati pravega zate."
        />
      </div>
    </>
  );
}
