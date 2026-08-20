import type { Metadata } from "next";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getUserInitials } from "@/lib/auth/user";
import { settingsContent } from "@/lib/content/settings";

export const metadata: Metadata = {
  title: "Nastavitve",
};

export default async function NastavitvePage() {
  const access = await requireAuthenticatedUser("/nastavitve");
  const content = {
    ...settingsContent,
    profile: {
      ...settingsContent.profile,
      firstName: access.user.firstName,
      lastName: access.user.lastName,
      email: access.user.email,
      username: access.user.email.split("@")[0] ?? access.user.firstName,
      initials: getUserInitials(access.user),
    },
  };

  return (
    <>
      <PageHeader
        title="Nastavitve"
        subtitle="Uredi svoje podatke, nastavitve računa in nastavitve učenja."
      />

      <SettingsClient content={content} />
      <SupportCard />
    </>
  );
}
