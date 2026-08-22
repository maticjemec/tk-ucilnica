import type { ReactNode } from "react";
import { headers } from "next/headers";
import { AdminDenied } from "@/components/admin/AdminDenied";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const access = await requireAdminPage();

  if (!access) {
    return <AdminDenied />;
  }

  const pathname = (await headers()).get("x-pathname") ?? "/admin";

  return <AdminShell pathname={pathname}>{children}</AdminShell>;
}
