import type { Metadata } from "next";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  firstSearchParam,
  getPublicCatalogPath,
  getPublicProgramPath,
} from "@/lib/auth/redirects";
import { PROGRAM_SLUG } from "@/lib/billing/constants";

export const metadata: Metadata = {
  title: "Plačilo preklicano",
  robots: { index: false, follow: false },
};

type CancelPageProps = {
  searchParams: Promise<{ slug?: string | string[] }>;
};

export default async function PurchaseCancelPage({
  searchParams,
}: CancelPageProps) {
  const slug = firstSearchParam((await searchParams).slug);
  const hasProgram = Boolean(slug && PROGRAM_SLUG.test(slug));

  return (
    <>
      <PageHeader
        title="Plačilo ni bilo izvedeno"
        subtitle="Nič ni bilo zaračunano. Če želiš, se lahko vrneš na program in poskusiš znova."
      />
      {hasProgram && slug ? (
        <ButtonLink href={getPublicProgramPath(slug)}>
          Nazaj na program
        </ButtonLink>
      ) : (
        <ButtonLink href={getPublicCatalogPath()}>Vsi programi</ButtonLink>
      )}
    </>
  );
}
