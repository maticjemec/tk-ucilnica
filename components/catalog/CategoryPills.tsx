"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { catalogFilters } from "@/lib/content/catalog";
import type { CatalogFilterId } from "@/types/catalog";

type CategoryPillsProps = {
  value: CatalogFilterId;
  onChange: (value: CatalogFilterId) => void;
};

export function CategoryPills({ value, onChange }: CategoryPillsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }

    updateOverflow();
    el.addEventListener("scroll", updateOverflow, { passive: true });
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateOverflow);
      observer.disconnect();
    };
  }, [updateOverflow]);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <div
          role="radiogroup"
          aria-label="Kategorije programov"
          className={cn("flex w-max gap-1.5", canScrollRight && "pr-12")}
        >
          {catalogFilters.map((filter) => {
            const selected = value === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(filter.id)}
                className={cn(
                  "inline-flex min-h-9 shrink-0 items-center rounded-full border px-3 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:border-accent/40 hover:bg-canvas",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {canScrollRight ? (
        <button
          type="button"
          aria-label="Pomakni kategorije desno"
          className="absolute top-1/2 right-0 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface shadow-[var(--shadow-card)]"
          onClick={() => {
            scrollerRef.current?.scrollBy({ left: 220, behavior: "smooth" });
          }}
        >
          <ChevronRight className="h-4 w-4 text-foreground" strokeWidth={1.75} />
        </button>
      ) : null}
    </div>
  );
}
