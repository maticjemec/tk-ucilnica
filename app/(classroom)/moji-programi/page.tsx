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
import { getOwnedCurriculumAndProgress } from "@/lib/progress/owned";
import { toPurchasedProgram } from "@/lib/programs";

export const metadata: Metadata = {
  title: "Moji programi",
};

export default async function MojiProgramiPage() {
  const access = await requireAuthenticatedUser("/moji-programi");
  const ownedSlugs = getOwnedProgramSlugs(access);
  const { bundles, progressBySlug } =
    await getOwnedCurriculumAndProgress(ownedSlugs);
  const programs = bundles.map((bundle) =>
    toPurchasedProgram(bundle.identity, progressBySlug.get(bundle.identity.slug)),
  );

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
