import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  fetchValidProgramEntitlements,
  isEntitlementCurrentlyValid,
} from "@/lib/auth/entitlements";
import { toUserSessionFromClaims } from "@/lib/auth/user";
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
import { isNextServerAction } from "@/lib/http/server-action";
import { createClient } from "@/lib/supabase/server";

const guestContext: GuestAccessContext = {
  status: "guest",
  user: null,
  entitlements: [],
};

/**
 * Single app-level access reader.
 *
 * Authentication is validated on the server with Supabase `getClaims()`,
 * which verifies the JWT locally (same authority the proxy already uses).
 * Owned program slugs come from public.user_programs via the entitlement
 * data layer. Missing, expired, or failed queries yield no ownership.
 */
export const getUserAccessContext = cache(
  async (): Promise<UserAccessContext> => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const user = !error && data?.claims
      ? toUserSessionFromClaims(data.claims)
      : null;

    if (!user) {
      return guestContext;
    }

    const entitlements = await fetchValidProgramEntitlements(
      supabase,
      user.id,
    );

    return {
      status: "authenticated",
      user,
      entitlements,
    };
  },
);

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
  // After sign-in/sign-up, Next re-renders the current auth page as part of
  // the server action. A redirect() there competes with the action result and
  // leaves the client stuck on "Prijava...". GET visits still bounce away.
  if (await isNextServerAction()) {
    return;
  }

  const access = await getUserAccessContext();

  if (access.status === "authenticated") {
    redirect(getSafeRedirectPath(redirectTo));
  }
}

export function getEntitlementForProgram(
  access: UserAccessContext,
  slug: string,
) {
  if (access.status !== "authenticated") {
    return null;
  }

  return (
    access.entitlements.find((item) => item.programSlug === slug) ?? null
  );
}

export function ownsProgram(access: UserAccessContext, slug: string) {
  if (access.status !== "authenticated") {
    return false;
  }

  return access.entitlements.some(
    (item) =>
      item.programSlug === slug &&
      isEntitlementCurrentlyValid(item.accessExpiresAt),
  );
}

export function getOwnedProgramSlugs(access: UserAccessContext) {
  if (access.status !== "authenticated") {
    return [];
  }

  return access.entitlements
    .filter((item) => isEntitlementCurrentlyValid(item.accessExpiresAt))
    .map((item) => item.programSlug);
}
