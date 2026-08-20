"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { getUserInitials } from "@/lib/auth/user";
import type { UserSession } from "@/lib/auth/types";

type TopbarProps = {
  user: UserSession;
  onOpenNavigation: () => void;
};

export function Topbar({ user, onOpenNavigation }: TopbarProps) {
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <IconButton label="Odpri navigacijo" onClick={onOpenNavigation}>
        <Menu className="h-5 w-5" strokeWidth={1.6} />
      </IconButton>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <IconButton label="Iskanje">
          <Search className="h-5 w-5" strokeWidth={1.6} />
        </IconButton>

        <IconButton label="Obvestila">
          <Bell className="h-5 w-5" strokeWidth={1.6} />
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-medium text-accent-foreground">
            3
          </span>
        </IconButton>

        <button
          type="button"
          className="ml-1 flex items-center gap-2.5 rounded-sm py-1 pr-1 pl-1 transition-colors hover:bg-border/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label="Račun"
        >
          <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#c4a07a,#8d6b4a)] text-sm font-medium text-white">
            {getUserInitials(user)}
          </span>
          <span className="hidden text-sm text-foreground sm:inline">
            {user.firstName}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted sm:block" strokeWidth={1.6} />
        </button>
      </div>
    </header>
  );
}
