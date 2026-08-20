import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { MyProgramsClient } from "@/components/my-programs/MyProgramsClient";
import { SupportCard } from "@/components/my-programs/SupportCard";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getOwnedProgramSlugs,
  requireAuthenticatedUser,
} from "@/lib/auth/access";
import { getPurchasedProgramsForSlugs } from "@/lib/content/programs";
import { getOwnedProgressBySlug } from "@/lib/progress/owned";

export const metadata: Metadata = {
  title: "Moji programi",
};

export default async function MojiProgramiPage() {
  const access = await requireAuthenticatedUser("/moji-programi");
  const ownedSlugs = getOwnedProgramSlugs(access);
  const progressBySlug = await getOwnedProgressBySlug(ownedSlugs);
  const programs = getPurchasedProgramsForSlugs(ownedSlugs, progressBySlug);

  return (
    <>
      <PageHeader
        title="Moji programi"
        subtitle="Tukaj vidiš vse programe, ki si jih kupil/a. Nadaljuj tam, kjer si končal/a."
        actions={
          <ButtonLink
            href="/programi"
            variant="outline"
            className="w-full sm:w-auto"
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            Razišči vse programe
          </ButtonLink>
        }
      />

      <MyProgramsClient programs={programs} />
      <SupportCard />
    </>
  );
}
