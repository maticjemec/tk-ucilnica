export type {
  AuthStatus,
  AuthenticatedAccessContext,
  GuestAccessContext,
  ProgramEntitlement,
  UserAccessContext,
  UserProgramRow,
  UserSession,
} from "@/lib/auth/types";

export {
  getEntitlementForProgram,
  getOwnedProgramSlugs,
  getUserAccessContext,
  ownsProgram,
  redirectIfAuthenticated,
  requireAuthenticatedUser,
  requireProgramEntitlement,
} from "@/lib/auth/access";

export {
  fetchValidProgramEntitlements,
  isEntitlementCurrentlyValid,
} from "@/lib/auth/entitlements";

export { getUserDisplayName, getUserInitials } from "@/lib/auth/user";

export {
  getLoginPath,
  getPublicCatalogPath,
  getPublicProgramPath,
  getRegisterPath,
  getSafeRedirectPath,
} from "@/lib/auth/redirects";
