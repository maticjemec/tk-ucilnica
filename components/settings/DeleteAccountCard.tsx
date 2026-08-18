"use client";

import { useEffect, useId, useState } from "react";
import { SettingsCard } from "@/components/settings/SettingsCard";
import { Button } from "@/components/ui/Button";

export function DeleteAccountCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SettingsCard title="Izbriši račun" compact>
        <p className="text-sm leading-relaxed text-muted">
          Če želiš trajno izbrisati svoj račun in vse podatke, klikni spodnji
          gumb.
        </p>
        <Button
          variant="destructive"
          size="sm"
          className="mt-3.5 h-9 w-full sm:w-auto"
          onClick={() => setOpen(true)}
        >
          Izbriši račun
        </Button>
      </SettingsCard>

      {open ? <DeleteAccountDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

type DeleteAccountDialogProps = {
  onClose: () => void;
};

function DeleteAccountDialog({ onClose }: DeleteAccountDialogProps) {
  const titleId = useId();

  useEffect(() => {
    document.getElementById("delete-account-close")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Zapri pogovorno okno"
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-md border border-border bg-surface p-6 shadow-[var(--shadow-card)]"
      >
        <h2 id={titleId} className="text-lg font-semibold tracking-tight text-foreground">
          Izbriši račun
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Brisanje računa bo na voljo po povezavi uporabniškega sistema.
        </p>
        <div className="mt-5 flex justify-end">
          <Button id="delete-account-close" variant="outline" onClick={onClose}>
            Zapri
          </Button>
        </div>
      </div>
    </div>
  );
}
