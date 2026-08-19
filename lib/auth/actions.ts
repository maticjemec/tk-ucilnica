"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MOCK_AUTH_COOKIE } from "@/lib/auth/mock-session";
import {
  DEFAULT_AFTER_AUTH_PATH,
  getPublicCatalogPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";

const mockCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Mock sign-in. Does not verify credentials.
 * Later: replace with Supabase `signInWithPassword`.
 */
export async function signInMock(redirectTo?: string) {
  const store = await cookies();
  store.set(MOCK_AUTH_COOKIE, "authenticated", mockCookieOptions);
  redirect(getSafeRedirectPath(redirectTo ?? DEFAULT_AFTER_AUTH_PATH));
}

/**
 * Mock sign-out.
 * Later: replace with Supabase `signOut`.
 */
export async function signOutMock() {
  const store = await cookies();
  store.set(MOCK_AUTH_COOKIE, "guest", mockCookieOptions);
  redirect(getPublicCatalogPath());
}
