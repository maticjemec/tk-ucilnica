"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { BrandLockup } from "@/components/branding/BrandLockup";
import { SidebarQuote } from "@/components/layout/SidebarQuote";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";
import { isNavItemActive, primaryNav, type PrimaryNavId } from "@/lib/navigation";

const navIcons: Record<PrimaryNavId, LucideIcon> = {
  pregled: LayoutDashboard,
  "moji-programi": BookOpen,
  programi: LayoutGrid,
  nastavitve: Settings,
};

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[var(--sidebar-width)] shrink-0 flex-col overflow-y-auto bg-sidebar text-sidebar-foreground">
      <BrandLockup />

      <nav aria-label="Glavna navigacija" className="flex flex-1 flex-col px-4">
        <ul className="flex flex-col gap-1">
          {primaryNav.map((item) => {
            const Icon = navIcons[item.id];
            const active = isNavItemActive(pathname, item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "nav-label flex items-center gap-3 rounded-md px-3 py-[0.7rem] transition-colors",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-sidebar-foreground/88 hover:bg-white/5 hover:text-sidebar-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] shrink-0",
                      active ? "text-accent-foreground" : "text-accent-soft",
                    )}
                    strokeWidth={1.6}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <form action={signOut}>
              <button
                type="submit"
                className="nav-label flex w-full items-center gap-3 rounded-md px-3 py-[0.7rem] text-sidebar-foreground/88 transition-colors hover:bg-white/5 hover:text-sidebar-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-soft"
              >
                <LogOut className="h-[18px] w-[18px] shrink-0 text-accent-soft" strokeWidth={1.6} />
                Odjava
              </button>
            </form>
          </li>
        </ul>

        <div className="mt-auto pb-6 pt-8">
          <SidebarQuote />
        </div>
      </nav>
    </aside>
  );
}
