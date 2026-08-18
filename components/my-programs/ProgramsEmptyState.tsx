import { ButtonLink } from "@/components/dashboard/ButtonLink";

export function ProgramsEmptyState() {
  return (
    <div className="rounded-md border border-border bg-surface px-6 py-14 text-center shadow-[var(--shadow-card)]">
      <p className="font-serif text-xl tracking-tight text-foreground">
        Nimaš programov v tej kategoriji.
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        Tukaj se prikažejo programi, ki si jih kupil/a. Razišči ponudbo in
        nadaljuj svojo pot, ko boš pripravljen/a.
      </p>
      <div className="mt-6 flex justify-center">
        <ButtonLink href="/programi" variant="outline">
          Razišči programe
        </ButtonLink>
      </div>
    </div>
  );
}
