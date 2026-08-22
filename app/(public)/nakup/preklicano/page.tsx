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
      <PageHeader title="Nakup" subtitle="Plačilo ni bilo dokončano." />
      <div className="flex flex-wrap gap-3">
        <ButtonLink
          href={
            hasProgram && slug
              ? getPublicProgramPath(slug)
              : getPublicCatalogPath()
          }
        >
          {hasProgram ? "Nazaj na program" : "Poglej programe"}
        </ButtonLink>
        {hasProgram ? (
          <ButtonLink href={getPublicCatalogPath()} variant="outline">
            Poglej programe
          </ButtonLink>
        ) : null}
      </div>
    </>
  );
}
