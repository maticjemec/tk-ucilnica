import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type ProgramSupportCardProps = {
  className?: string;
};

export function ProgramSupportCard({ className }: ProgramSupportCardProps) {
  return (
    <Card padding="none" className={cn("px-5 py-5", className)}>
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Niste sami
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Na voljo smo vam na vsakem koraku vaše poti.
      </p>
      <Button
        variant="outline"
        className="mt-3.5 w-full"
        type="button"
        disabled
        title="Podpora bo kmalu na voljo."
      >
        <Mail className="h-4 w-4" strokeWidth={1.6} aria-hidden />
        Kontakt kmalu
      </Button>
    </Card>
  );
}
