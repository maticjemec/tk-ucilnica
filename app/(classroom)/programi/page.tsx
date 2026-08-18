import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Vsi programi",
};

export default function ProgramiPage() {
  return (
    <PageHeader
      title="Vsi programi"
      subtitle="Stran bo izdelana v naslednji nalogi."
    />
  );
}
