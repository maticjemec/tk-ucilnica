export type {
  AuthStatus,
  AuthenticatedAccessContext,
  GuestAccessContext,
  ProgramEntitlement,
  UserAccessContext,
  UserSession,
} from "@/lib/auth/types";

export {
  getOwnedProgramSlugs,
  getUserAccessContext,
  ownsProgram,
  redirectIfAuthenticated,
  requireAuthenticatedUser,
  requireProgramEntitlement,
} from "@/lib/auth/access";

export {
  MOCK_AUTH_MODE,
  MOCK_OWNED_PROGRAM_SLUGS,
  MOCK_USER,
  getUserDisplayName,
  getUserInitial,
} from "@/lib/auth/mock-session";

export {
  getLoginPath,
  getPublicCatalogPath,
  getPublicProgramPath,
  getRegisterPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
