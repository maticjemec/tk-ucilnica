import { Check } from "lucide-react";
import { Card } from "@/components/ui/Card";

type OwnedBenefitsProps = {
  benefits: string[];
};

export function OwnedBenefits({ benefits }: OwnedBenefitsProps) {
  if (benefits.length === 0) {
    return null;
  }

  return (
    <Card padding="none" className="px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        Kaj boš dosegla / dosegel
      </h2>
      <ul className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <li
            key={benefit}
            className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85"
          >
            <Check
              className="mt-[0.15rem] h-3.5 w-3.5 shrink-0 text-accent"
              strokeWidth={2.2}
              aria-hidden
            />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
