import type { Metadata } from "next";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { getUserAccessContext, ownsProgram } from "@/lib/auth/access";
import { firstSearchParam, getLoginPath } from "@/lib/auth/redirects";
import { CHECKOUT_SESSION_ID } from "@/lib/billing/constants";
import { getPurchaseForAuthenticatedUser } from "@/lib/billing/fulfill";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";

export const metadata: Metadata = {
  title: "Plačilo uspešno",
  robots: { index: false, follow: false },
};

type SuccessPageProps = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

export default async function PurchaseSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const sessionId = firstSearchParam((await searchParams).session_id);
  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    return (
      <PurchaseResult
        title="Plačilo smo prejeli. Dostop do programa se pripravlja."
        href={getLoginPath("/nakup/uspesno")}
        cta="Prijavi se"
      />
    );
  }

  const purchase =
    sessionId && CHECKOUT_SESSION_ID.test(sessionId)
      ? await getPurchaseForAuthenticatedUser(sessionId, access.user.id)
      : null;
  const programSlug = purchase?.program_slug;
  const owned = programSlug ? ownsProgram(access, programSlug) : false;

  if (owned && programSlug) {
    return (
      <PurchaseResult
        title="Plačilo je bilo uspešno."
        href={getOwnedProgramOverviewPath(programSlug)}
        cta="Odpri program"
      />
    );
  }

  return (
    <PurchaseResult
      title="Plačilo smo prejeli. Dostop do programa se pripravlja."
      href="/moji-programi"
      cta="Moji programi"
    />
  );
}

function PurchaseResult({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <>
      <PageHeader title="Nakup" subtitle={title} />
      <ButtonLink href={href}>{cta}</ButtonLink>
    </>
  );
}
