import { ButtonLink } from "@/components/dashboard/ButtonLink";

type ProgramsEmptyStateProps = {
  variant?: "none" | "filter";
};

export function ProgramsEmptyState({
  variant = "filter",
}: ProgramsEmptyStateProps) {
  const title =
    variant === "none"
      ? "Nimaš še kupljenih programov."
      : "Nimaš programov v tej kategoriji.";
  const description =
    variant === "none"
      ? "Tukaj se prikažejo programi, ki jih kupiš. Razišči ponudbo in začni, ko boš pripravljen/a."
      : "V tem filtru trenutno ni programov. Preklopi kategorijo ali razišči ponudbo.";

  return (
    <div className="rounded-md border border-border bg-surface px-6 py-16 text-center shadow-[var(--shadow-card)] sm:px-10">
      <p className="font-serif text-[1.45rem] tracking-tight text-foreground sm:text-[1.6rem]">
        {title}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
        {description}
      </p>
      <div className="mt-7 flex justify-center">
        <ButtonLink
          href="/programi"
          variant={variant === "none" ? "primary" : "outline"}
        >
          Razišči programe
        </ButtonLink>
      </div>
    </div>
  );
}
