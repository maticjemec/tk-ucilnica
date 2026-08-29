import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getUserAccessContext } from "@/lib/auth/access";
import { getForgotPasswordPath } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Novo geslo",
};

export default async function ResetPasswordPage() {
  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    redirect(`${getForgotPasswordPath()}?napaka=povezava`);
  }

  return <ResetPasswordForm />;
}
