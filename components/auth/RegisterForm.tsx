"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { useAuthDestination } from "@/components/auth/useAuthDestination";
import { Button } from "@/components/ui/Button";
import { signUp } from "@/lib/auth/actions";
import { getLoginPath } from "@/lib/auth/redirects";

type RegisterFormProps = {
  redirectTo?: string;
};

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function RegisterForm({ redirectTo }: RegisterFormProps) {
  const goToDestination = useAuthDestination();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [pending, startTransition] = useTransition();

  function validate() {
    const next: RegisterErrors = {};

    if (!firstName.trim()) {
      next.firstName = "Vnesi ime.";
    }

    if (!lastName.trim()) {
      next.lastName = "Vnesi priimek.";
    }

    if (!email.trim()) {
      next.email = "Vnesi e-poštni naslov.";
    } else if (!isValidEmail(email.trim())) {
      next.email = "Vnesi veljaven e-poštni naslov.";
    }

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
        const result = await signUp({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
          confirmPassword,
          redirectTo,
        });

        if ("needsEmailConfirmation" in result) {
          setNeedsEmailConfirmation(true);
          return;
        }

        if ("error" in result) {
          setFormError(result.error);
          return;
        }

        goToDestination(result.redirectTo);
      } catch {
        setFormError(
          "Prišlo je do nepričakovane napake pri registraciji. Poskusi znova.",
        );
      }
    });
  }

  if (needsEmailConfirmation) {
    return (
      <AuthCard
        title="Preveri e-pošto"
        supporting="Poslali smo ti povezavo za potrditev računa. Ko jo potrdiš, se lahko prijaviš."
        footer={
          <p>
            Že imaš račun?{" "}
            <Link
              href={getLoginPath(redirectTo)}
              className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Prijavi se
            </Link>
          </p>
        }
      >
        <p className="mt-8 text-center text-sm leading-relaxed text-muted">
          Če e-pošte ne vidiš, preveri tudi mapo z neželeno pošto.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Ustvari račun"
      supporting="Začni svojo pot v spletni učilnici."
      footer={
        <p>
          Že imaš račun?{" "}
          <Link
            href={getLoginPath(redirectTo)}
            className="font-medium text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Prijavi se
          </Link>
        </p>
      }
    >
      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthField
            id="firstName"
            name="firstName"
            label="Ime"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            error={errors.firstName}
            required
            disabled={pending}
          />
          <AuthField
            id="lastName"
            name="lastName"
            label="Priimek"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            error={errors.lastName}
            required
            disabled={pending}
          />
        </div>
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
          {pending ? "Ustvarjanje..." : "Ustvari račun"}
        </Button>
      </form>
    </AuthCard>
  );
}
