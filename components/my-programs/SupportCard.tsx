import { Leaf, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function SupportCard() {
  return (
    <Card padding="none" className="mt-6 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-3.5 sm:items-center">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-accent">
            <Leaf className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="font-medium text-foreground">Potrebuješ pomoč?</p>
            <p className="mt-0.5 text-sm leading-relaxed text-muted">
              Če imaš vprašanje ali potrebuješ podporo, smo tukaj zate.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full shrink-0 sm:w-auto"
          type="button"
        >
          <Mail className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          Kontaktiraj podporo
        </Button>
      </div>
    </Card>
  );
}
