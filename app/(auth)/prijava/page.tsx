import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { redirectIfAuthenticated } from "@/lib/auth/access";
import { firstSearchParam } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Prijava",
};

type PrijavaPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export default async function PrijavaPage({ searchParams }: PrijavaPageProps) {
  const params = await searchParams;
  const redirectTo = firstSearchParam(params.redirectTo);

  await redirectIfAuthenticated(redirectTo);

  return <LoginForm redirectTo={redirectTo} />;
}
