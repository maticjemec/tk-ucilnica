import type { ReactNode } from "react";
import type { Metadata } from "next";
import { PurchaseAccessPoller } from "@/components/billing/PurchaseAccessPoller";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { Card } from "@/components/ui/Card";
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
      <PurchaseStatus
        title="Plačilo je uspešno"
        subtitle="Program je zdaj na voljo v tvoji učilnici."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={getOwnedProgramOverviewPath(view.programSlug)}
            className="w-full sm:w-auto"
          >
            Odpri program
          </ButtonLink>
          <ButtonLink
            href="/moji-programi"
            variant="outline"
            className="w-full sm:w-auto"
          >
            Moji programi
          </ButtonLink>
        </div>
      </PurchaseStatus>
    );
  }

  if (view.state === "preparing") {
    return (
      <PurchaseStatus
        title="Plačilo smo prejeli"
        subtitle="Dostop do programa se pripravlja. To običajno traja le nekaj trenutkov."
      >
        <ButtonLink
          href={`/nakup/uspesno?session_id=${encodeURIComponent(view.sessionId)}`}
          className="w-full sm:w-auto"
        >
          Preveri dostop
        </ButtonLink>
        <PurchaseAccessPoller />
      </PurchaseStatus>
    );
  }

  return (
    <PurchaseStatus
      title="Nakup"
      subtitle="Če je bilo plačilo uspešno, bo program kmalu na voljo v tvoji učilnici."
    >
      <ButtonLink href="/moji-programi" className="w-full sm:w-auto">
        Moji programi
      </ButtonLink>
    </PurchaseStatus>
  );
}

function PurchaseStatus({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Card padding="none" className="mx-auto max-w-xl px-6 py-8 sm:px-8 sm:py-10">
      <h1 className="page-title text-[1.85rem] sm:text-[2.1rem]">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
      <div className="mt-7">{children}</div>
    </Card>
  );
}
