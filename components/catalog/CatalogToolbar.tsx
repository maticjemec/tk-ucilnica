import type { ReactNode } from "react";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/cn";
import { catalogSortOptions } from "@/lib/content/catalog";
import type { CatalogSortId, CatalogView } from "@/types/catalog";

type CatalogToolbarProps = {
  sort: CatalogSortId;
  view: CatalogView;
  onSortChange: (value: CatalogSortId) => void;
  onViewChange: (value: CatalogView) => void;
};

export function CatalogToolbar({
  sort,
  view,
  onSortChange,
  onViewChange,
}: CatalogToolbarProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="catalog-sort" className="sr-only">
        Razvrsti programe
      </label>
      <select
        id="catalog-sort"
        value={sort}
        onChange={(event) => onSortChange(event.target.value as CatalogSortId)}
        className="field h-9 min-w-0 flex-1 py-0 pr-8 text-sm sm:w-[11.5rem] sm:flex-none"
      >
        {catalogSortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      <div
        role="group"
        aria-label="Prikaz programov"
        className="flex shrink-0 items-center gap-1"
      >
        <ViewButton
          pressed={view === "grid"}
          label="Mreža"
          onClick={() => onViewChange("grid")}
        >
          <LayoutGrid className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        </ViewButton>
        <ViewButton
          pressed={view === "list"}
          label="Seznam"
          onClick={() => onViewChange("list")}
        >
          <List className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        </ViewButton>
      </div>
    </div>
  );
}

type ViewButtonProps = {
  pressed: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
};

function ViewButton({ pressed, label, onClick, children }: ViewButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm border transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        pressed
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-surface text-foreground/70 hover:border-border hover:bg-canvas hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
