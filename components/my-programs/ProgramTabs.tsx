import { cn } from "@/lib/cn";
import type { ProgramFilter } from "@/types/programs";

type ProgramTabsProps = {
  value: ProgramFilter;
  onChange: (value: ProgramFilter) => void;
};

const tabs: Array<{ id: ProgramFilter; label: string }> = [
  { id: "all", label: "Vsi" },
  { id: "in-progress", label: "V teku" },
  { id: "completed", label: "Zaključeni" },
];

export function ProgramTabs({ value, onChange }: ProgramTabsProps) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:-mx-0 sm:px-0">
      <div
        role="tablist"
        aria-label="Filter programov"
        className="flex min-w-full gap-7 border-b border-border"
      >
        {tabs.map((tab) => {
          const selected = value === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`moji-programi-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls="moji-programi-panel"
              tabIndex={0}
              className={cn(
                "-mb-px min-h-11 shrink-0 border-b-2 pb-3 text-sm whitespace-nowrap transition-colors",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                selected
                  ? "border-accent font-medium text-foreground"
                  : "border-transparent text-foreground/70 hover:text-foreground",
              )}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
