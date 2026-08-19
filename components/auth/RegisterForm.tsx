"use client";

import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthField } from "@/components/auth/AuthField";
import { Button } from "@/components/ui/Button";
import { signInMock } from "@/lib/auth/actions";
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
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

    if (!validate()) {
      return;
    }

    startTransition(() => {
      void signInMock(redirectTo);
    });
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
        className="mt-8 flex flex-col gap-4"
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
        />

        <div aria-live="polite">
          {Object.keys(errors).length > 0 ? (
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
