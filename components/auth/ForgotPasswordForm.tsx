"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { requestPasswordReset } from "@/lib/auth/actions";
import { getLoginPath } from "@/lib/auth/redirects";

type ForgotPasswordFormProps = {
  notice?: string | null;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function ForgotPasswordForm({ notice }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(notice ?? null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSentMessage(null);

    if (!email.trim()) {
      setEmailError("Vnesi e-poštni naslov.");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setEmailError("Vnesi veljaven e-poštni naslov.");
      return;
    }

    setEmailError(undefined);

    startTransition(async () => {
      try {
        const result = await requestPasswordReset({ email: email.trim() });

        if ("error" in result) {
          setFormError(result.error);
          return;
        }

        setSentMessage(result.message);
      } catch {
        setFormError("Ponastavitve gesla trenutno ni mogoče začeti. Poskusi znova.");
      }
    });
  }

  return (
    <AuthCard
      title="Pozabljeno geslo"
      supporting="Vnesi e-pošto in poslali ti bomo povezavo za novo geslo."
      footer={
        <p>
          Spomniš se gesla?{" "}
          <Link
            href={getLoginPath()}
            className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Prijavi se
          </Link>
        </p>
      }
    >
      {sentMessage ? (
        <p className="mt-8 text-center text-sm leading-relaxed text-muted">
          {sentMessage}
        </p>
      ) : (
        <form
          className="mt-8 flex flex-col gap-5"
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
            error={emailError}
            required
            disabled={pending}
          />

          <div aria-live="polite" className="min-h-[1.25rem]">
            {formError ? (
              <p className="text-sm text-danger">{formError}</p>
            ) : null}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={pending}>
            {pending ? "Pošiljam..." : "Pošlji povezavo"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
