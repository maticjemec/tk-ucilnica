import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { requireAuthenticatedUser } from "@/lib/auth/access";

export const dynamic = "force-dynamic";

export default async function ClassroomLayout({
  children,
}: {
  children: ReactNode;
}) {
  const access = await requireAuthenticatedUser();
  return <AppShell user={access.user}>{children}</AppShell>;
}
