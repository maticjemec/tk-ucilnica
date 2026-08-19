import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type LessonBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function LessonBreadcrumb({ items }: LessonBreadcrumbProps) {
  return (
    <nav aria-label="Pot" className="mb-4 min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 overflow-x-auto text-[0.8rem] text-muted [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 shrink-0 items-center gap-1.5 last:min-w-0 last:shrink"
            >
              {index > 0 ? (
                <ChevronRight
                  className="h-3.5 w-3.5 shrink-0 text-muted/70"
                  strokeWidth={1.8}
                  aria-hidden
                />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="whitespace-nowrap transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "whitespace-nowrap",
                    isLast && "block max-w-[14rem] truncate sm:max-w-[22rem]",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
