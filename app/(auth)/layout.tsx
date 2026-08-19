import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-foreground">
      <div className="mx-auto flex w-full max-w-[28rem] flex-1 flex-col justify-center px-5 py-10 sm:py-14">
        {children}
      </div>
    </div>
  );
}
