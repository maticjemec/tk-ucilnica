export type AuthStatus = "guest" | "authenticated";

export type UserSession = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type ProgramEntitlement = {
  programSlug: string;
  source: "purchase";
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
