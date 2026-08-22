import "server-only";

import { isEntitlementCurrentlyValid } from "@/lib/auth/entitlements";
import { PROGRAM_SLUG } from "@/lib/billing/constants";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Authoritative ownership check against public.user_programs.
 * Used before Checkout creation. Cached access context is not enough.
 */
export async function userOwnsProgram(userId: string, programSlug: string) {
  if (!PROGRAM_SLUG.test(programSlug)) {
    return { owned: false as const, readable: true as const };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_programs")
    .select("access_expires_at")
    .eq("user_id", userId)
    .eq("program_slug", programSlug)
    .maybeSingle();

  if (error) {
    console.error("[billing] Failed to verify program ownership.");
    return { owned: false as const, readable: false as const };
  }

  if (!isRecord(data)) {
    return { owned: false as const, readable: true as const };
  }

  if (
    data.access_expires_at != null &&
    typeof data.access_expires_at !== "string"
  ) {
    return { owned: false as const, readable: true as const };
  }

  return {
    owned: isEntitlementCurrentlyValid(
      typeof data.access_expires_at === "string" ? data.access_expires_at : null,
    ),
    readable: true as const,
  };
}
