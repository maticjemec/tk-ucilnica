import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Moji programi",
};

export default function MojiProgramiPage() {
  return (
    <PageHeader
      title="Moji programi"
      subtitle="Stran bo izdelana v naslednji nalogi."
    />
  );
}
