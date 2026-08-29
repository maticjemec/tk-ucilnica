import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirectIfAuthenticated } from "@/lib/auth/access";
import { firstSearchParam } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Prijava",
};

type PrijavaPageProps = {
  searchParams: Promise<{
    redirectTo?: string | string[];
    napaka?: string | string[];
  }>;
};

export default async function PrijavaPage({ searchParams }: PrijavaPageProps) {
  const params = await searchParams;
  const redirectTo = firstSearchParam(params.redirectTo);
  const napaka = firstSearchParam(params.napaka);
  const notice =
    napaka === "potrditev"
      ? "Potrditev računa ni uspela. Zahtevaj novo povezavo ali se prijavi."
      : null;

  await redirectIfAuthenticated(redirectTo);

  return <LoginForm redirectTo={redirectTo} notice={notice} />;
}
