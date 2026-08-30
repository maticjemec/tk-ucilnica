import { Card } from "@/components/ui/Card";

export function OwnedCurriculumUnavailable() {
  return (
    <Card padding="none" className="px-6 py-10 sm:px-8 sm:py-12">
      <h2 className="font-serif text-[1.45rem] leading-tight tracking-tight text-foreground sm:text-[1.6rem]">
        Vsebina programa
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Vsebina tega programa še ni na voljo. Ko bodo lekcije pripravljene,
        jih boš videl/a tukaj.
      </p>
    </Card>
  );
}
