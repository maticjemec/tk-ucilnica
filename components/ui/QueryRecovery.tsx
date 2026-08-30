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
    <div className="rounded-md border border-border bg-surface px-6 py-16 text-center shadow-[var(--shadow-card)] sm:px-10">
      <p className="font-serif text-[1.45rem] tracking-tight text-foreground sm:text-[1.6rem]">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-7 flex justify-center">
        <Button onClick={() => router.refresh()}>Poskusi znova</Button>
      </div>
    </div>
  );
}
