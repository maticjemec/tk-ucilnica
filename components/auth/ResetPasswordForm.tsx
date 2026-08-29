"use client";

import { useState, useTransition, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuthDestination } from "@/components/auth/useAuthDestination";
import { Button } from "@/components/ui/Button";
import { updatePassword } from "@/lib/auth/actions";

export function ResetPasswordForm() {
  const goToDestination = useAuthDestination();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function validate() {
    const next: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      next.password = "Vnesi geslo.";
    } else if (password.length < 8) {
      next.password = "Geslo mora imeti vsaj 8 znakov.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Ponovi geslo.";
    } else if (confirmPassword !== password) {
      next.confirmPassword = "Gesli se ne ujemata.";
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
        const result = await updatePassword({
          password,
          confirmPassword,
        });

        if ("error" in result) {
          setFormError(result.error);
          return;
        }

        goToDestination(result.redirectTo);
      } catch {
        setFormError("Gesla ni bilo mogoče posodobiti. Poskusi znova.");
      }
    });
  }

  return (
    <AuthCard
      title="Novo geslo"
      supporting="Nastavi novo geslo za svoj račun."
    >
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <AuthField
          id="password"
          name="password"
          label="Novo geslo"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          required
          disabled={pending}
        />
        <AuthField
          id="confirmPassword"
          name="confirmPassword"
          label="Ponovi geslo"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
          required
          disabled={pending}
        />

        <div aria-live="polite" className="min-h-[1.25rem]">
          {formError ? (
            <p className="text-sm text-danger">{formError}</p>
          ) : Object.keys(errors).length > 0 ? (
            <p className="sr-only">Obrazec vsebuje napake.</p>
          ) : null}
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Shranjujem..." : "Shrani geslo"}
        </Button>
      </form>
    </AuthCard>
  );
}
