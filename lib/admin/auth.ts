import "server-only";

import {
  getRequestPath,
  getUserAccessContext,
  requireAuthenticatedUser,
} from "@/lib/auth/access";
import type { AuthenticatedAccessContext } from "@/lib/auth/types";
import { isAllowlistedAdminEmail } from "@/lib/admin/env";
import { ADMIN_ERRORS, adminFail, type AdminActionResult } from "@/lib/admin/errors";

export function isAdminEmail(email: string) {
  return isAllowlistedAdminEmail(email);
}

/**
 * Layout/page gate. Guests go to login. Non-admins get null.
 * Never treat client-provided identity as admin.
 */
export async function requireAdminPage(
  returnPath?: string,
): Promise<AuthenticatedAccessContext | null> {
  const access = await requireAuthenticatedUser(
    returnPath ?? (await getRequestPath("/admin")),
  );

  if (!isAdminEmail(access.user.email)) {
    return null;
  }

  return access;
}

/**
 * Mutation/query gate. Does not redirect — returns a Slovenian error.
 */
export async function requireAdminMutation(): Promise<
  AdminActionResult<AuthenticatedAccessContext>
> {
  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    return adminFail(ADMIN_ERRORS.unauthenticated);
  }

  if (!isAdminEmail(access.user.email)) {
    return adminFail(ADMIN_ERRORS.forbidden);
  }

  return { ok: true, data: access };
}
