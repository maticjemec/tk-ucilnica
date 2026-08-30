import { Check, Leaf } from "lucide-react";
import { cn } from "@/lib/cn";

type ProgramBenefitsProps = {
  description: string;
  benefits: string[];
  className?: string;
};

export function ProgramBenefits({
  description,
  benefits,
  className,
}: ProgramBenefitsProps) {
  return (
    <div className={cn("bg-surface", className)}>
      <div className="px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-7 lg:px-8 md:border-t md:border-border">
        <p className="max-w-[42rem] text-[0.925rem] leading-[1.75] text-foreground/82">
          {description}
        </p>

        <div className="mt-6 rounded-md bg-[#f6f0e6] px-5 py-5">
          <div className="flex items-center gap-2">
            <Leaf
              className="h-3.5 w-3.5 shrink-0 text-accent"
              strokeWidth={1.7}
              aria-hidden
            />
            <h2 className="text-[0.95rem] font-semibold tracking-tight text-foreground">
              Kaj pridobiš?
            </h2>
          </div>

          <ul className="mt-3.5 flex flex-col gap-2.5">
            {benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2.5 text-[0.875rem] leading-relaxed text-foreground/85"
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
        </div>
      </div>
    </div>
  );
}
