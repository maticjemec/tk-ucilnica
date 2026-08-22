import type { ReactNode } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/branding/BrandMark";
import { cn } from "@/lib/cn";

type AdminShellProps = {
  children: ReactNode;
  pathname: string;
};

const NAV = [
  { href: "/admin", label: "Pregled" },
  { href: "/admin/programi", label: "Programi" },
] as const;

export function AdminShell({ children, pathname }: AdminShellProps) {
  return (
    <div className="min-h-full bg-canvas">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark className="h-8 w-8 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="font-serif text-[1.05rem] tracking-[0.16em] text-foreground">
                TK HIPNOZA
              </p>
              <p className="text-[0.62rem] font-medium tracking-[0.22em] text-muted uppercase">
                Admin
              </p>
            </div>
          </div>
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-sm px-3 py-1.5 text-sm",
                    active
                      ? "bg-warning-soft text-warning-foreground"
                      : "text-muted hover:bg-canvas hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="rounded-sm px-3 py-1.5 text-sm text-muted hover:bg-canvas hover:text-foreground"
            >
              Učilnica
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8">{children}</div>
    </div>
  );
}
