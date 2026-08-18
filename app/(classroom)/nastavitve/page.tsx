import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Nastavitve",
};

export default function NastavitvePage() {
  return (
    <PageHeader
      title="Nastavitve"
      subtitle="Stran bo izdelana v naslednji nalogi."
    />
  );
}
