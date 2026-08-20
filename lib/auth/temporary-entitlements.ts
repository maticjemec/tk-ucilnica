import type { ProgramEntitlement } from "@/lib/auth/types";

/**
 * TEMPORARY entitlement compatibility layer (TASK 010B).
 *
 * Authentication is real (Supabase Auth).
 * Program ownership is still mocked so the classroom remains testable
 * after login. TASK 011 will replace this with database entitlements.
 *
 * Do not use this module as a source of authentication.
 */
export const MOCK_OWNED_PROGRAM_SLUGS = [
  "21-dni-do-manj-anksioznosti",
  "21-dni-do-boljse-samozavesti",
  "najdi-sebe",
  "samohipnoza-v-praksi",
] as const;

export function getTemporaryEntitlements(): ProgramEntitlement[] {
  return MOCK_OWNED_PROGRAM_SLUGS.map((programSlug) => ({
    programSlug,
    source: "purchase",
  }));
}
