import type { Metadata } from "next";
import { PurchaseAccessPoller } from "@/components/billing/PurchaseAccessPoller";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireAuthenticatedUser } from "@/lib/auth/access";
import { firstSearchParam, getCheckoutSuccessPath } from "@/lib/auth/redirects";
import { resolveCheckoutSuccessView } from "@/lib/billing/success";
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
  const access = await requireAuthenticatedUser(
    getCheckoutSuccessPath(sessionId),
  );
  const view = await resolveCheckoutSuccessView(sessionId, access.user.id);

  if (view.state === "owned") {
    return (
      <>
        <PageHeader
          title="Plačilo je uspešno"
          subtitle="Program je zdaj na voljo v tvoji učilnici."
        />
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={getOwnedProgramOverviewPath(view.programSlug)}>
            Odpri program
          </ButtonLink>
          <ButtonLink href="/moji-programi" variant="outline">
            Moji programi
          </ButtonLink>
        </div>
      </>
    );
  }

  if (view.state === "preparing") {
    return (
      <>
        <PageHeader
          title="Plačilo smo prejeli"
          subtitle="Dostop do programa se pripravlja. To običajno traja le nekaj trenutkov."
        />
        <ButtonLink
          href={`/nakup/uspesno?session_id=${encodeURIComponent(view.sessionId)}`}
        >
          Preveri dostop
        </ButtonLink>
        <PurchaseAccessPoller />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Nakup"
        subtitle="Če je bilo plačilo uspešno, bo program kmalu na voljo v tvoji učilnici."
      />
      <ButtonLink href="/moji-programi">Moji programi</ButtonLink>
    </>
  );
}
