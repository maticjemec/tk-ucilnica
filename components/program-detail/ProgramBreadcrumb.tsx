import Link from "next/link";
import { ChevronRight } from "lucide-react";

type ProgramBreadcrumbProps = {
  label: string;
};

export function ProgramBreadcrumb({ label }: ProgramBreadcrumbProps) {
  return (
    <nav aria-label="Pot" className="mb-4">
      <ol className="flex min-w-0 flex-wrap items-center gap-1.5 text-[0.8rem] text-muted">
        <li className="min-w-0">
          <Link
            href="/programi"
            className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Vsi programi
          </Link>
        </li>
        <li aria-hidden className="inline-flex shrink-0 text-muted/70">
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </li>
        <li className="min-w-0 truncate text-muted">{label}</li>
      </ol>
    </nav>
  );
}
