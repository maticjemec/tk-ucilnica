"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type QueryRecoveryProps = {
  title: string;
  description: string;
};

export function QueryRecovery({ title, description }: QueryRecoveryProps) {
  const router = useRouter();

  return (
    <div className="rounded-md border border-border bg-surface px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <p className="font-serif text-xl tracking-tight text-foreground">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-6 flex justify-center">
        <Button variant="outline" onClick={() => router.refresh()}>
          Poskusi znova
        </Button>
      </div>
    </div>
  );
}
