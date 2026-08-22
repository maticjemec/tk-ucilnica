"use server";

import { startProgramCheckout } from "@/lib/billing/checkout";

export async function startProgramCheckoutAction(programSlug: string) {
  return startProgramCheckout(programSlug);
}
