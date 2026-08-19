import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  buildMockAccessContext,
  MOCK_AUTH_COOKIE,
  resolveMockAuthStatus,
} from "@/lib/auth/mock-session";
import {
  getLoginPath,
  getPublicCatalogPath,
  getPublicProgramPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
import type {
  AuthenticatedAccessContext,
  UserAccessContext,
} from "@/lib/auth/types";

/**
 * Single app-level access reader.
 *
 * Today: mock config + optional mock cookie.
 * Later: replace the body with Supabase Auth (`getUser`) and an entitlements query.
 * Callers (`requireAuthenticatedUser`, layouts, pages) should stay unchanged.
 */
export async function getUserAccessContext(): Promise<UserAccessContext> {
  const store = await cookies();
  const status = resolveMockAuthStatus(store.get(MOCK_AUTH_COOKIE)?.value);
  return buildMockAccessContext(status);
}

export async function getRequestPath(fallback = "/") {
  const headerStore = await headers();
  return headerStore.get("x-pathname") ?? fallback;
}

export async function requireAuthenticatedUser(
  returnPath?: string,
): Promise<AuthenticatedAccessContext> {
  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    redirect(getLoginPath(returnPath ?? (await getRequestPath())));
  }

  return access;
}

const PROGRAM_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function requireProgramEntitlement(
  slug: string,
  returnPath?: string,
): Promise<AuthenticatedAccessContext> {
  if (!PROGRAM_SLUG.test(slug)) {
    redirect(getPublicCatalogPath());
  }

  const access = await requireAuthenticatedUser(
    returnPath ?? `/moji-programi/${slug}`,
  );

  if (!ownsProgram(access, slug)) {
    redirect(getPublicProgramPath(slug));
  }

  return access;
}

export async function redirectIfAuthenticated(redirectTo?: string) {
  const access = await getUserAccessContext();

  if (access.status === "authenticated") {
    redirect(getSafeRedirectPath(redirectTo));
  }
}

export function ownsProgram(access: UserAccessContext, slug: string) {
  if (access.status !== "authenticated") {
    return false;
  }

  return access.entitlements.some((item) => item.programSlug === slug);
}

export function getOwnedProgramSlugs(access: UserAccessContext) {
  if (access.status !== "authenticated") {
    return [];
  }

  return access.entitlements.map((item) => item.programSlug);
}
