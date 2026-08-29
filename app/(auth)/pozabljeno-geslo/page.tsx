import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { redirectIfAuthenticated } from "@/lib/auth/access";
import {
  firstSearchParam,
  getResetPasswordPath,
} from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Pozabljeno geslo",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{ napaka?: string | string[] }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  await redirectIfAuthenticated(getResetPasswordPath());

  const napaka = firstSearchParam((await searchParams).napaka);
  const notice =
    napaka === "povezava"
      ? "Povezava za ponastavitev ni veljavna ali je potekla. Zahtevaj novo."
      : null;

  return <ForgotPasswordForm notice={notice} />;
}
