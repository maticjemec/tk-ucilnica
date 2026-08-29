"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getLoginPath } from "@/lib/auth/redirects";
import { startProgramCheckoutAction } from "@/lib/billing/actions";
import { cn } from "@/lib/cn";
import { formatCatalogPrice } from "@/lib/content/catalog";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { programDetailIcons } from "@/components/program-detail/icons";
import type { ProgramDetail } from "@/types/program-detail";

type PurchaseCardProps = {
  program: ProgramDetail;
  isAuthenticated: boolean;
  className?: string;
};

export function PurchaseCard({
  program,
  isAuthenticated,
  className,
}: PurchaseCardProps) {
  const owned = program.accessState === "owned";
  const unavailable = program.accessState === "unavailable";
  const programPath = `/programi/${program.slug}`;

  return (
    <Card padding="none" className={cn("px-5 py-5", className)}>
      {owned ? (
        <p className="text-sm text-muted">Program je že tvoj.</p>
      ) : unavailable ? (
        <p className="text-sm text-muted">
          Dostopa trenutno ni mogoče preveriti.
        </p>
      ) : (
        <p className="pt-0.5 font-serif text-[2.15rem] leading-none font-semibold tracking-tight text-foreground">
          {formatCatalogPrice(program.price)}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        {owned ? (
          <ButtonLink
            href={getOwnedProgramOverviewPath(program.slug)}
            className="h-11 w-full px-5"
          >
            Odpri program
          </ButtonLink>
        ) : unavailable ? (
          <AccessRetryButton />
        ) : isAuthenticated ? (
          <CheckoutButton programSlug={program.slug} />
        ) : (
          <ButtonLink
            href={getLoginPath(programPath)}
            className="h-11 w-full px-5"
          >
            Prijavi se za nakup
          </ButtonLink>
        )}
      </div>

      {owned || unavailable ? null : (
        <div className="mt-4 border-t border-border pt-3.5">
          <ul className="flex flex-col gap-2.5">
            {program.purchaseBenefits.map((item) => {
              const Icon = programDetailIcons[item.icon];
              return (
                <li
                  key={item.id}
                  className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-x-2.5 text-[0.8125rem] leading-relaxed text-muted"
                >
                  <Icon
                    className="mt-[0.12rem] h-4 w-4 shrink-0 text-accent"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

    </Card>
  );
}

function AccessRetryButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="h-11 w-full px-5"
      onClick={() => router.refresh()}
    >
      Poskusi znova
    </Button>
  );
}

function CheckoutButton({ programSlug }: { programSlug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (pending) {
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const result = await startProgramCheckoutAction(programSlug);

        if (!result) {
          setError("Plačila trenutno ni mogoče začeti. Poskusi znova čez trenutek.");
          return;
        }

        if ("error" in result) {
          setError(result.error);
          return;
        }

        if ("checkoutUrl" in result && result.checkoutUrl.startsWith("https://")) {
          window.location.assign(result.checkoutUrl);
          return;
        }

        if ("redirectTo" in result) {
          router.replace(result.redirectTo);
          return;
        }

        setError("Plačila trenutno ni mogoče začeti. Poskusi znova čez trenutek.");
      } catch {
        setError("Plačila trenutno ni mogoče začeti. Poskusi znova čez trenutek.");
      }
    });
  }

  return (
    <>
      <Button
        className="w-full"
        size="lg"
        disabled={pending}
        onClick={onClick}
      >
        {pending ? "Preusmerjam na varno plačilo …" : "Kupi program"}
      </Button>
      {error ? (
        <p className="text-sm leading-relaxed text-danger">{error}</p>
      ) : null}
    </>
  );
}
