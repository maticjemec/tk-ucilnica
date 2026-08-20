"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  GENERIC_SIGN_UP_ERROR,
  UNEXPECTED_SIGN_UP_ERROR,
  mapSignInError,
  mapSignUpError,
} from "@/lib/auth/errors";
import {
  DEFAULT_AFTER_AUTH_PATH,
  getPublicCatalogPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 80;

export type AuthActionResult =
  | { error: string }
  | { needsEmailConfirmation: true };

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

function logSignupThrownError(error: unknown) {
  const thrown =
    typeof error === "object" && error !== null
      ? (error as { message?: unknown; code?: unknown; status?: unknown })
      : null;

  console.error("SUPABASE SIGNUP ERROR", {
    message:
      thrown && typeof thrown.message === "string"
        ? thrown.message
        : error instanceof Error
          ? error.message
          : "unknown",
    code: thrown && typeof thrown.code === "string" ? thrown.code : undefined,
    status: thrown && typeof thrown.status === "number" ? thrown.status : undefined,
  });
}

async function getOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";

  if (!host) {
    return null;
  }

  return `${protocol}://${host}`;
}

export async function signIn(input: {
  email: string;
  password: string;
  redirectTo?: string;
}): Promise<Extract<AuthActionResult, { error: string }> | void> {
  const email = input.email.trim();
  const password = input.password;

  if (!email || !isValidEmail(email) || !password) {
    return { error: "Neveljavna e-pošta ali geslo." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: mapSignInError(error) };
  }

  revalidatePath("/", "layout");
  redirect(getSafeRedirectPath(input.redirectTo ?? DEFAULT_AFTER_AUTH_PATH));
}

export async function signUp(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  redirectTo?: string;
}): Promise<AuthActionResult | void> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const email = input.email.trim();
  const password = input.password;

  if (!firstName || firstName.length > MAX_NAME_LENGTH) {
    return { error: "Vnesi ime." };
  }

  if (!lastName || lastName.length > MAX_NAME_LENGTH) {
    return { error: "Vnesi priimek." };
  }

  if (!email || !isValidEmail(email)) {
    return { error: "Vnesi veljaven e-poštni naslov." };
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return { error: "Geslo mora imeti vsaj 8 znakov." };
  }

  if (password !== input.confirmPassword) {
    return { error: "Gesli se ne ujemata." };
  }

  const origin = await getOrigin();
  const next = getSafeRedirectPath(input.redirectTo ?? DEFAULT_AFTER_AUTH_PATH);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: origin
          ? `${origin}/auth/confirm?next=${encodeURIComponent(next)}`
          : undefined,
      },
    });

    console.log("SUPABASE SIGNUP RESULT", {
      hasUser: Boolean(data?.user),
      hasSession: Boolean(data?.session),
    });

    if (error) {
      console.error("SUPABASE SIGNUP ERROR", {
        message: error.message,
        code: error.code,
        status: error.status,
      });
      return { error: mapSignUpError(error) };
    }

    if (data.session) {
      revalidatePath("/", "layout");
      redirect(next);
    }

    if (data.user) {
      return { needsEmailConfirmation: true };
    }

    return { error: GENERIC_SIGN_UP_ERROR };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    logSignupThrownError(error);
    return { error: UNEXPECTED_SIGN_UP_ERROR };
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(getPublicCatalogPath());
}
