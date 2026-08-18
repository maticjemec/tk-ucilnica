import type { Metadata } from "next";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { catalogPrograms } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Vsi programi",
};

export default function ProgramiPage() {
  return (
    <>
      <CatalogClient programs={catalogPrograms} />
      <div className="pt-2">
        <SupportCard
          title="Ne najdeš programa zase?"
          description="Piši nam in pomagali ti bomo izbrati pravega zate."
        />
      </div>
    </>
  );
}
