import "server-only";

import Stripe from "stripe";
import { getStripeSecretKey } from "@/lib/billing/env";

let stripe: Stripe | null = null;

/**
 * Lazy server-only Stripe client.
 * Instantiated on first use so builds do not require the secret.
 */
export function getStripeClient() {
  if (!stripe) {
    stripe = new Stripe(getStripeSecretKey());
  }

  return stripe;
}
