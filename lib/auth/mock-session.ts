import type {
  AuthStatus,
  AuthenticatedAccessContext,
  GuestAccessContext,
  ProgramEntitlement,
  UserAccessContext,
  UserSession,
} from "@/lib/auth/types";

/**
 * DEVELOPMENT MOCK AUTH
 *
 * Change this single value to switch the default session without editing
 * other files:
 * - "guest" → public catalog / program detail only
 * - "authenticated" → Tina Korošec, owns 21-dni-do-boljse-samozavesti
 *
 * Login and logout set a mock cookie (`tk-ucilnica-mock-auth`) that overrides
 * this default for the current browser. That cookie is not real authentication
 * and will be removed when Supabase Auth is wired in.
 *
 * To return to this constant, log out or delete the cookie.
 */
export const MOCK_AUTH_MODE: AuthStatus = "authenticated";

export const MOCK_AUTH_COOKIE = "tk-ucilnica-mock-auth";

export const MOCK_USER: UserSession = {
  id: "mock-user-tina-korosec",
  firstName: "Tina",
  lastName: "Korošec",
  email: "tina.korosec@gmail.com",
};

export const MOCK_OWNED_PROGRAM_SLUGS = [
  "21-dni-do-boljse-samozavesti",
] as const;

const mockEntitlements: ProgramEntitlement[] = MOCK_OWNED_PROGRAM_SLUGS.map(
  (programSlug) => ({
    programSlug,
    source: "purchase",
  }),
);

const guestContext: GuestAccessContext = {
  status: "guest",
  user: null,
  entitlements: [],
};

const authenticatedContext: AuthenticatedAccessContext = {
  status: "authenticated",
  user: MOCK_USER,
  entitlements: mockEntitlements,
};

export function resolveMockAuthStatus(
  cookieValue: string | undefined,
): AuthStatus {
  if (cookieValue === "guest" || cookieValue === "authenticated") {
    return cookieValue;
  }

  return MOCK_AUTH_MODE;
}

export function buildMockAccessContext(status: AuthStatus): UserAccessContext {
  return status === "authenticated" ? authenticatedContext : guestContext;
}

export function getUserDisplayName(user: UserSession) {
  return `${user.firstName} ${user.lastName}`;
}

export function getUserInitial(user: UserSession) {
  return user.firstName.charAt(0).toUpperCase();
}
