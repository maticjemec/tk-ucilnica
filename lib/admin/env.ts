import "server-only";

/**
 * Comma, semicolon, or newline separated admin emails.
 * Example: ADMIN_EMAILS=you@example.com,other@example.com
 * Empty / missing → nobody is an admin.
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim();

  if (!raw) {
    return [];
  }

  return raw
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.includes("@"));
}

export function isAllowlistedAdminEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  return getAdminEmails().includes(normalized);
}
