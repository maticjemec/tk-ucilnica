import "server-only";

import { CHECKOUT_SESSION_ID } from "@/lib/billing/constants";
import { getStripeClient } from "@/lib/billing/client";
import { getPurchaseForAuthenticatedUser } from "@/lib/billing/fulfill";
import { userOwnsProgram } from "@/lib/billing/ownership";

export type CheckoutSuccessView =
  | { state: "owned"; programSlug: string }
  | { state: "preparing"; sessionId: string }
  | { state: "generic" };

/**
 * Success-page status only. Never grants entitlement.
 * session_id is used to load Stripe + our ledger row, then verify the
 * authenticated user owns that purchase row.
 */
export async function resolveCheckoutSuccessView(
  sessionId: string | undefined,
  userId: string,
): Promise<CheckoutSuccessView> {
  if (!sessionId || !CHECKOUT_SESSION_ID.test(sessionId)) {
    return { state: "generic" };
  }

  let stripeSessionId: string;

  try {
    const session = await getStripeClient().checkout.sessions.retrieve(sessionId);
    stripeSessionId = session.id;

    const purchase = await getPurchaseForAuthenticatedUser(
      stripeSessionId,
      userId,
    );

    if (!purchase) {
      return { state: "generic" };
    }

    const ownership = await userOwnsProgram(userId, purchase.program_slug);

    if (ownership.owned) {
      return { state: "owned", programSlug: purchase.program_slug };
    }

    if (session.payment_status === "paid") {
      return { state: "preparing", sessionId: stripeSessionId };
    }
  } catch {
    console.error("[billing] Failed to resolve Checkout success state.");
    return { state: "generic" };
  }

  return { state: "generic" };
}
