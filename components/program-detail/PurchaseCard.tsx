"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Gift, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatCatalogPrice } from "@/lib/content/catalog";
import { programDetailIcons } from "@/components/program-detail/icons";
import type { ProgramDetail } from "@/types/program-detail";

const purchaseMessage =
  "Nakup bo omogočen po povezavi uporabniškega in plačilnega sistema.";
const giftMessage = "Darilni nakup bo omogočen kmalu.";

type PurchaseCardProps = {
  program: ProgramDetail;
  className?: string;
};

export function PurchaseCard({ program, className }: PurchaseCardProps) {
  const owned = program.accessState === "owned";
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <Card padding="none" className={cn("px-5 py-5", className)}>
      {owned ? (
        <p className="text-sm text-muted">Program je že tvoj.</p>
      ) : (
        <p className="pt-0.5 font-serif text-[2.15rem] leading-none font-semibold tracking-tight text-foreground">
          {formatCatalogPrice(program.price)}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            if (!owned) {
              setNotice(purchaseMessage);
            }
          }}
        >
          {owned ? "Začni program" : "Vključi se v program"}
        </Button>

        {owned ? null : (
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => setNotice(giftMessage)}
          >
            <Gift className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            Podari program
          </Button>
        )}
      </div>

      {owned ? null : (
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

      <PurchaseNotice
        message={notice}
        onClose={() => setNotice(null)}
      />
    </Card>
  );
}

function PurchaseNotice({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
      <button
        type="button"
        className="absolute inset-0 bg-[#1c1916]/40"
        aria-label="Zapri obvestilo"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[26rem] rounded-md border border-border bg-surface px-5 py-5 shadow-[var(--shadow-card)] sm:px-6"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="text-[1.05rem] font-semibold tracking-tight">
            Kmalu na voljo
          </h2>
          <button
            ref={closeRef}
            type="button"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted transition-colors hover:bg-border/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Zapri"
            onClick={onClose}
          >
            <X className="h-4 w-4" strokeWidth={1.7} />
          </button>
        </div>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{message}</p>
        <Button className="mt-5 w-full" onClick={onClose}>
          Razumem
        </Button>
      </div>
    </div>
  );
}
