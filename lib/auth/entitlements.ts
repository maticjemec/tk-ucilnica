import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgramEntitlement, UserProgramRow } from "@/lib/auth/types";

const USER_PROGRAMS_TABLE = "user_programs";

const USER_PROGRAM_COLUMNS =
  "id, user_id, program_slug, granted_at, access_expires_at, source, created_at";

/**
 * Entitlement is valid when access_expires_at is null or in the future.
 * Unreadable expiry values fail closed.
 */
export function isEntitlementCurrentlyValid(
  accessExpiresAt: string | null | undefined,
  now = new Date(),
) {
  if (accessExpiresAt == null || accessExpiresAt === "") {
    return true;
  }

  const expiresAt = Date.parse(accessExpiresAt);

  if (Number.isNaN(expiresAt)) {
    return false;
  }

  return expiresAt > now.getTime();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readRequiredString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function parseUserProgramRow(value: unknown): UserProgramRow | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = readRequiredString(value.id);
  const userId = readRequiredString(value.user_id);
  const programSlug = readRequiredString(value.program_slug);
  const grantedAt = readRequiredString(value.granted_at);
  const source = readRequiredString(value.source);
  const createdAt = readRequiredString(value.created_at);

  if (!id || !userId || !programSlug || !grantedAt || !source || !createdAt) {
    return null;
  }

  if (value.access_expires_at != null && typeof value.access_expires_at !== "string") {
    return null;
  }

  return {
    id,
    user_id: userId,
    program_slug: programSlug,
    granted_at: grantedAt,
    access_expires_at: value.access_expires_at ?? null,
    source,
    created_at: createdAt,
  };
}

function toProgramEntitlement(row: UserProgramRow): ProgramEntitlement {
  return {
    programSlug: row.program_slug,
    source: row.source,
    grantedAt: row.granted_at,
    accessExpiresAt: row.access_expires_at,
  };
}

/**
 * Server-only entitlement reader.
 *
 * Queries public.user_programs with the authenticated user's session client.
 * Fails closed: query errors, missing table, and invalid rows yield no access.
 * This module does not insert, update, or delete entitlement rows.
 */
export async function fetchValidProgramEntitlements(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProgramEntitlement[]> {
  const { data, error } = await supabase
    .from(USER_PROGRAMS_TABLE)
    .select(USER_PROGRAM_COLUMNS)
    .eq("user_id", userId);

  if (error) {
    console.error("[entitlements] Failed to load program entitlements.");
    return [];
  }

  if (!Array.isArray(data)) {
    console.error("[entitlements] Failed to load program entitlements.");
    return [];
  }

  const now = new Date();
  const entitlements: ProgramEntitlement[] = [];

  for (const item of data) {
    const row = parseUserProgramRow(item);

    if (!row || !isEntitlementCurrentlyValid(row.access_expires_at, now)) {
      continue;
    }

    entitlements.push(toProgramEntitlement(row));
  }

  return entitlements;
}
