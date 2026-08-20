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

export { MOCK_OWNED_PROGRAM_SLUGS } from "@/lib/auth/temporary-entitlements";

export { getUserDisplayName, getUserInitials } from "@/lib/auth/user";

export {
  getLoginPath,
  getPublicCatalogPath,
  getPublicProgramPath,
  getRegisterPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
