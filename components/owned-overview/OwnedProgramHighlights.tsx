import {
  CalendarDays,
  FileText,
  Infinity as InfinityIcon,
  Play,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { OwnedProgramHighlight } from "@/types/owned-program";

const highlightIcons: Record<OwnedProgramHighlight["icon"], LucideIcon> = {
  calendar: CalendarDays,
  play: Play,
  file: FileText,
  infinity: InfinityIcon,
};

type OwnedProgramHighlightsProps = {
  highlights: OwnedProgramHighlight[];
};

export function OwnedProgramHighlights({
  highlights,
}: OwnedProgramHighlightsProps) {
  return (
    <Card padding="none" className="h-full px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="sr-only">O programu</h2>
      <ul className="flex flex-col gap-4">
        {highlights.map((item) => {
          const Icon = highlightIcons[item.icon];

          return (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-accent">
                <Icon className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-sm leading-snug font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-sm leading-snug text-muted">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
