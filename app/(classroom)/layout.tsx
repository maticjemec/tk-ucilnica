import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function ClassroomLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
