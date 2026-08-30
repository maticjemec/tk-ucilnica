import { ButtonLink } from "@/components/dashboard/ButtonLink";

type LessonNavItem = {
  href: string;
  label: string;
};

type LessonNavigationProps = {
  previous?: LessonNavItem;
  next?: LessonNavItem;
};

export function LessonNavigation({ previous, next }: LessonNavigationProps) {
  return (
    <nav
      aria-label="Prejšnja in naslednja lekcija"
      className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between"
    >
      {previous ? (
        <ButtonLink
          href={previous.href}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <span aria-hidden>←</span>
          Prejšnja lekcija
          <span className="sr-only">: {previous.label}</span>
        </ButtonLink>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next ? (
        <ButtonLink
          href={next.href}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Naslednja lekcija
          <span aria-hidden>→</span>
          <span className="sr-only">: {next.label}</span>
        </ButtonLink>
      ) : null}
    </nav>
  );
}
