import type { Metadata } from "next";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { settingsContent } from "@/lib/content/settings";

export const metadata: Metadata = {
  title: "Nastavitve",
};

export default function NastavitvePage() {
  return (
    <>
      <PageHeader
        title="Nastavitve"
        subtitle="Uredi svoje podatke, nastavitve računa in nastavitve učenja."
      />

      <SettingsClient content={settingsContent} />
      <SupportCard />
    </>
  );
}
