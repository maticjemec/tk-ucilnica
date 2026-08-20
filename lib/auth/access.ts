import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTemporaryEntitlements } from "@/lib/auth/temporary-entitlements";
import { toUserSession } from "@/lib/auth/user";
import {
  getLoginPath,
  getPublicCatalogPath,
  getPublicProgramPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
import type {
  AuthenticatedAccessContext,
  GuestAccessContext,
  UserAccessContext,
} from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";

const guestContext: GuestAccessContext = {
  status: "guest",
  user: null,
  entitlements: [],
};

/**
 * Single app-level access reader.
 *
 * Authentication is validated on the server with Supabase `getUser()`.
 * Entitlements currently come from a temporary compatibility layer
 * and will be replaced by a database query in TASK 011.
 */
export async function getUserAccessContext(): Promise<UserAccessContext> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return guestContext;
  }

  return {
    status: "authenticated",
    user: toUserSession(data.user),
    entitlements: getTemporaryEntitlements(),
  };
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
