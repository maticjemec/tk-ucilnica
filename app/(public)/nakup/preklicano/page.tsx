import type { Metadata } from "next";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { Card } from "@/components/ui/Card";
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
    <Card padding="none" className="mx-auto max-w-xl px-6 py-8 sm:px-8 sm:py-10">
      <h1 className="page-title text-[1.85rem] sm:text-[2.1rem]">
        Plačilo ni bilo izvedeno
      </h1>
      <p className="page-subtitle">
        Nič ni bilo zaračunano. Če želiš, se lahko vrneš na program in poskusiš
        znova.
      </p>
      <div className="mt-7">
        {hasProgram && slug ? (
          <ButtonLink
            href={getPublicProgramPath(slug)}
            className="w-full sm:w-auto"
          >
            Nazaj na program
          </ButtonLink>
        ) : (
          <ButtonLink href={getPublicCatalogPath()} className="w-full sm:w-auto">
            Vsi programi
          </ButtonLink>
        )}
      </div>
    </Card>
  );
}
