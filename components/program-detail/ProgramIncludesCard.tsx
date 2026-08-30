import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { programDetailIcons } from "@/components/program-detail/icons";
import type { ProgramDetailListItem } from "@/types/program-detail";

type ProgramIncludesCardProps = {
  items: ProgramDetailListItem[];
  className?: string;
};

export function ProgramIncludesCard({
  items,
  className,
}: ProgramIncludesCardProps) {
  return (
    <Card padding="none" className={cn("px-5 py-5", className)}>
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        V programu dobiš
      </h2>
      <ul className="mt-3.5 flex flex-col gap-2.5">
        {items.map((item) => {
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
    </Card>
  );
}
