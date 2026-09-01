"use server";

import { getUserAccessContext } from "@/lib/auth/access";
import { startProgramCheckout } from "@/lib/billing/checkout";
import { BILLING_ERRORS } from "@/lib/billing/errors";
import { reconcilePaidCheckoutSessionForUser } from "@/lib/billing/reconcile";

export async function startProgramCheckoutAction(programSlug: string) {
  return startProgramCheckout(programSlug);
}

export async function reconcileCheckoutAccessAction(sessionId: string) {
  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    return { ok: false as const, error: BILLING_ERRORS.unauthenticated };
  }

  return reconcilePaidCheckoutSessionForUser(sessionId, access.user.id);
}
