"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { reconcileCheckoutAccessAction } from "@/lib/billing/actions";

type CheckPurchaseAccessButtonProps = {
  sessionId: string;
};

export function CheckPurchaseAccessButton({
  sessionId,
}: CheckPurchaseAccessButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkAccess() {
    setPending(true);
    setError(null);

    const result = await reconcileCheckoutAccessAction(sessionId);

    if (!result.ok) {
      setPending(false);
      setError(result.error);
      return;
    }

    router.refresh();
    setPending(false);
  }

  return (
    <div className="grid gap-3">
      <Button
        type="button"
        size="lg"
        className="w-full sm:w-auto"
        disabled={pending}
        onClick={() => void checkAccess()}
      >
        {pending ? "Preverjam dostop…" : "Preveri dostop"}
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
