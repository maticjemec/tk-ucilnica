import { createClient } from "@/lib/supabase/server";
import { getSupabasePublicEnvOrNull } from "@/lib/supabase/env";

export type SupabaseConnectionResult =
  | { ok: true }
  | { ok: false; reason: "missing_env" | "unreachable"; message?: string };

/**
 * Server-only connectivity check. Safe to call from server code.
 * Does not create UI and does not expose credentials.
 */
export async function verifySupabaseConnection(): Promise<SupabaseConnectionResult> {
  const env = getSupabasePublicEnvOrNull();

  if (!env) {
    return { ok: false, reason: "missing_env" };
  }

  try {
    const healthResponse = await fetch(new URL("/auth/v1/health", env.url), {
      headers: {
        apikey: env.publishableKey,
        Authorization: `Bearer ${env.publishableKey}`,
      },
      cache: "no-store",
    });

    if (!healthResponse.ok) {
      return {
        ok: false,
        reason: "unreachable",
        message: `Auth health check failed (${healthResponse.status})`,
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.getClaims();

    if (error) {
      return {
        ok: false,
        reason: "unreachable",
        message: error.message,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "unreachable",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
