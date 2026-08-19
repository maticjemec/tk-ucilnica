import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";

type PublicShellProps = {
  children: ReactNode;
  currentPath?: string;
};

export function PublicShell({ children, currentPath }: PublicShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-foreground">
      <PublicHeader currentPath={currentPath} />
      <main className="min-h-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-6 sm:px-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
