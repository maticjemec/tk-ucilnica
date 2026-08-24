import type { User } from "@supabase/supabase-js";
import type { UserSession } from "@/lib/auth/types";

function readMetadataString(
  metadata: User["user_metadata"],
  key: string,
): string {
  const value = metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function emailPrefix(email: string) {
  const prefix = email.split("@")[0]?.trim();
  return prefix && prefix.length > 0 ? prefix : "Uporabnik";
}

function readClaimString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Map a verified JWT payload (getClaims) to the app session.
 * Signature verification happens in supabase.auth.getClaims().
 */
export function toUserSessionFromClaims(claims: object): UserSession | null {
  if (!isRecord(claims)) {
    return null;
  }

  const id = readClaimString(claims.sub);

  if (!id) {
    return null;
  }

  const metadata = isRecord(claims.user_metadata) ? claims.user_metadata : {};
  const email = readClaimString(claims.email) || readClaimString(metadata.email);
  const firstName = readClaimString(metadata.first_name);
  const lastName = readClaimString(metadata.last_name);

  return {
    id,
    firstName: firstName || emailPrefix(email),
    lastName,
    email,
  };
}

export function toUserSession(user: User): UserSession {
  const email = user.email?.trim() ?? "";
  const firstName = readMetadataString(user.user_metadata, "first_name");
  const lastName = readMetadataString(user.user_metadata, "last_name");

  return {
    id: user.id,
    firstName: firstName || emailPrefix(email),
    lastName,
    email,
  };
}

export function getUserDisplayName(user: UserSession) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  if (fullName) {
    return fullName;
  }

  return emailPrefix(user.email);
}

export function getUserInitials(user: UserSession) {
  const parts = getUserDisplayName(user).split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts[parts.length - 1]?.charAt(0) ?? "";
    return `${first}${last}`.toUpperCase();
  }

  return (parts[0]?.charAt(0) ?? "U").toUpperCase();
}
