"use client";

import { useCallback, useState, type ReactNode } from "react";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import type { UserSession } from "@/lib/auth/types";

type AppShellProps = {
  children: ReactNode;
  user: UserSession;
};

export function AppShell({ children, user }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas text-foreground">
      <div className="hidden h-full lg:flex">
        <Sidebar />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar user={user} onOpenNavigation={() => setMobileNavOpen(true)} />
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-2 sm:px-8 lg:px-10">
            {children}
          </div>
        </main>
      </div>

      <MobileNavigation open={mobileNavOpen} onClose={closeMobileNav} />
    </div>
  );
}

