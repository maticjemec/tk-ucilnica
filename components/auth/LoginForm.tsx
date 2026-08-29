"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuthDestination } from "@/components/auth/useAuthDestination";
import { Button } from "@/components/ui/Button";
import { signIn } from "@/lib/auth/actions";
import { getForgotPasswordPath, getRegisterPath } from "@/lib/auth/redirects";

type LoginFormProps = {
  redirectTo?: string;
  notice?: string | null;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginForm({ redirectTo, notice }: LoginFormProps) {
  const goToDestination = useAuthDestination();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState<string | null>(notice ?? null);
  const [pending, startTransition] = useTransition();

  function validate() {
    const next: LoginErrors = {};

    if (!email.trim()) {
      next.email = "Vnesi e-poštni naslov.";
    } else if (!isValidEmail(email.trim())) {
      next.email = "Vnesi veljaven e-poštni naslov.";
    }

    if (!password) {
      next.password = "Vnesi geslo.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await signIn({
          email: email.trim(),
          password,
          redirectTo,
        });

        if ("error" in result) {
          setFormError(result.error);
          return;
        }

        goToDestination(result.redirectTo);
      } catch {
        setFormError("Prijava trenutno ni uspela. Poskusi znova.");
      }
    });
  }

  return (
    <AuthCard
      title="Prijava"
      supporting="Prijavi se in nadaljuj svojo pot."
      footer={
        <p>
          Še nimaš računa?{" "}
          <Link
            href={getRegisterPath(redirectTo)}
            className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Ustvari račun
          </Link>
        </p>
      }
    >
      <form
        className="mt-8 flex flex-col gap-4"
        onSubmit={onSubmit}
        noValidate
      >
        <AuthField
          id="email"
          name="email"
          label="E-pošta"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
          disabled={pending}
        />
        <AuthField
          id="password"
          name="password"
          label="Geslo"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
          disabled={pending}
        />

        <div className="flex justify-end">
          <Link
            href={getForgotPasswordPath()}
            className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Pozabljeno geslo?
          </Link>
        </div>

        <div aria-live="polite" className="min-h-[1.25rem]">
          {formError ? (
            <p className="text-sm text-danger">{formError}</p>
          ) : Object.keys(errors).length > 0 ? (
            <p className="sr-only">Obrazec vsebuje napake.</p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Prijava..." : "Prijava"}
        </Button>
      </form>
    </AuthCard>
  );
}
