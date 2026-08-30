import Link from "next/link";
import { BrandMark } from "@/components/branding/BrandMark";
import { ButtonLink } from "@/components/dashboard/ButtonLink";
import { getLoginPath, getRegisterPath } from "@/lib/auth/redirects";

type PublicHeaderProps = {
  currentPath?: string;
};

export function PublicHeader({ currentPath = "/programi" }: PublicHeaderProps) {
  return (
    <header className="shrink-0 border-b border-border bg-surface">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4 lg:px-10">
        <Link
          href="/programi"
          className="flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BrandMark className="h-9 w-9 shrink-0 text-accent" />
          <span className="min-w-0">
            <span className="block font-serif text-[1.05rem] leading-none tracking-[0.16em] text-foreground">
              TK HIPNOZA
            </span>
            <span className="mt-1 block text-[0.62rem] font-medium tracking-[0.22em] text-muted uppercase">
              Spletna učilnica
            </span>
          </span>
        </Link>

        <nav
          aria-label="Račun"
          className="flex shrink-0 items-center gap-2 sm:gap-2.5"
        >
          <ButtonLink
            href={getLoginPath(currentPath)}
            variant="outline"
            className="h-11 px-3.5 text-sm sm:px-4"
          >
            Prijava
          </ButtonLink>
          <ButtonLink
            href={getRegisterPath(currentPath)}
            className="h-11 px-3.5 text-sm sm:px-4"
          >
            Ustvari račun
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
