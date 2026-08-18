import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ProgramAuthor } from "@/types/program-detail";

type ProgramAuthorCardProps = {
  author: ProgramAuthor;
  className?: string;
};

export function ProgramAuthorCard({ author, className }: ProgramAuthorCardProps) {
  return (
    <Card padding="none" className={cn("px-5 py-5", className)}>
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-foreground">
        O avtorici
      </h2>

      <div className="mt-3.5 flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3e6d8] font-serif text-[0.7rem] font-semibold tracking-[0.06em] text-accent"
        >
          {author.initials}
        </span>
        <div className="min-w-0">
          <p className="text-[0.9375rem] leading-snug font-medium text-foreground">
            {author.name}
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-snug text-muted">
            {author.role}
          </p>
        </div>
      </div>

      <p className="mt-3.5 text-sm leading-relaxed text-muted">{author.bio}</p>

      <button
        type="button"
        className="mt-3.5 block text-sm text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Več o meni →
      </button>
    </Card>
  );
}
