import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  action?: {
    href: string;
    label: string;
  };
  spacing?: "tight" | "roomy";
};

export function SectionHeading({
  title,
  action,
  spacing = "tight",
}: SectionHeadingProps) {
  return (
    <div
      className={
        spacing === "roomy"
          ? "mb-5 flex items-end justify-between gap-4"
          : "mb-3.5 flex items-end justify-between gap-4"
      }
    >
      <h2 className="font-serif text-[1.55rem] leading-tight tracking-tight text-foreground md:text-[1.7rem]">
        {title}
      </h2>
      {action ? (
        <Link
          href={action.href}
          className="mb-0.5 shrink-0 text-sm text-accent transition-colors hover:text-accent-hover"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
