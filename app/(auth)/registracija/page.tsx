import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { redirectIfAuthenticated } from "@/lib/auth/access";
import { firstSearchParam } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Ustvari račun",
};

type RegistracijaPageProps = {
  searchParams: Promise<{ redirectTo?: string | string[] }>;
};

export default async function RegistracijaPage({
  searchParams,
}: RegistracijaPageProps) {
  const params = await searchParams;
  const redirectTo = firstSearchParam(params.redirectTo);

  await redirectIfAuthenticated(redirectTo);

  return <RegisterForm redirectTo={redirectTo} />;
}
