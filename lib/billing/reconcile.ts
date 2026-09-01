import "server-only";

import { CHECKOUT_SESSION_ID, USER_UUID } from "@/lib/billing/constants";
import { getStripeClient } from "@/lib/billing/client";
import { BILLING_ERRORS } from "@/lib/billing/errors";
import {
  fulfillPaidCheckoutSession,
  getPurchaseForAuthenticatedUser,
} from "@/lib/billing/fulfill";
import { userOwnsProgram } from "@/lib/billing/ownership";

export type ReconcileCheckoutAccessResult =
  | { ok: true; state: "owned"; programSlug: string }
  | { ok: true; state: "preparing" }
  | { ok: false; error: string };

/**
 * Authenticated fallback when the Stripe webhook has not fulfilled yet.
 * Retrieves the Checkout Session with the server secret and runs the same
 * fulfillment used by the webhook. Never trusts query slugs or client amounts.
 */
export async function reconcilePaidCheckoutSessionForUser(
  sessionId: string,
  userId: string,
): Promise<ReconcileCheckoutAccessResult> {
  if (!CHECKOUT_SESSION_ID.test(sessionId) || !USER_UUID.test(userId)) {
    return { ok: false, error: BILLING_ERRORS.reconcileFailed };
  }

  let session;

  try {
    session = await getStripeClient().checkout.sessions.retrieve(sessionId);
  } catch {
    console.error("[billing] Failed to retrieve Checkout Session for reconcile.");
    return { ok: false, error: BILLING_ERRORS.reconcileFailed };
  }

  const purchase = await getPurchaseForAuthenticatedUser(session.id, userId);

  if (!purchase) {
    return { ok: false, error: BILLING_ERRORS.reconcileFailed };
  }

  const alreadyOwned = await userOwnsProgram(userId, purchase.program_slug);

  if (alreadyOwned.owned) {
    return { ok: true, state: "owned", programSlug: purchase.program_slug };
  }

  if (session.payment_status !== "paid") {
    return { ok: false, error: BILLING_ERRORS.notPaid };
  }

  try {
    await fulfillPaidCheckoutSession(session);
  } catch {
    console.error("[billing] Failed to fulfill Checkout Session during reconcile.");
    return { ok: false, error: BILLING_ERRORS.reconcileFailed };
  }

  const after = await userOwnsProgram(userId, purchase.program_slug);

  if (after.owned) {
    return { ok: true, state: "owned", programSlug: purchase.program_slug };
  }

  return { ok: true, state: "preparing" };
}
