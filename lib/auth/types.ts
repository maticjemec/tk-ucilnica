export type AuthStatus = "guest" | "authenticated";

export type UserSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type UserProgramRow = {
  id: string;
  user_id: string;
  program_slug: string;
  granted_at: string;
  access_expires_at: string | null;
  source: string;
  created_at: string;
};

export type ProgramEntitlement = {
  programSlug: string;
  source: string;
  accessExpiresAt: string | null;
};

export type GuestAccessContext = {
  status: "guest";
  user: null;
  entitlements: [];
};

export type AuthenticatedAccessContext = {
  status: "authenticated";
  user: UserSession;
  entitlements: ProgramEntitlement[];
};

export type UserAccessContext = GuestAccessContext | AuthenticatedAccessContext;
