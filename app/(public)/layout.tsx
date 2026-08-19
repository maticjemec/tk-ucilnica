import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PublicShell } from "@/components/layout/PublicShell";
import { getRequestPath, getUserAccessContext } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const access = await getUserAccessContext();

  if (access.status === "authenticated") {
    return <AppShell user={access.user}>{children}</AppShell>;
  }

  const currentPath = await getRequestPath("/programi");
  return <PublicShell currentPath={currentPath}>{children}</PublicShell>;
}
