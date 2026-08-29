const LOGIN_PATH = "/prijava";
const REGISTER_PATH = "/registracija";
const FORGOT_PASSWORD_PATH = "/pozabljeno-geslo";
const RESET_PASSWORD_PATH = "/ponastavi-geslo";
const CHECKOUT_SUCCESS_PATH = "/nakup/uspesno";
const DEFAULT_AFTER_AUTH_PATH = "/";
const PUBLIC_CATALOG_PATH = "/programi";

const SAFE_INTERNAL_PATH = /^\/(?:[a-zA-Z0-9._~-]+\/?)*$/;
const SAFE_CHECKOUT_SESSION_ID = /^cs_(test|live)_[A-Za-z0-9]+$/;

function splitPathAndQuery(value: string) {
  const withoutHash = value.split("#")[0] ?? value;
  const queryIndex = withoutHash.indexOf("?");

  if (queryIndex === -1) {
    return { path: withoutHash, query: "" };
  }

  return {
    path: withoutHash.slice(0, queryIndex),
    query: withoutHash.slice(queryIndex + 1),
  };
}

function getAllowedRedirectQuery(path: string, query: string) {
  if (path !== CHECKOUT_SUCCESS_PATH || !query) {
    return "";
  }

  const sessionId = new URLSearchParams(query).get("session_id");

  if (sessionId && SAFE_CHECKOUT_SESSION_ID.test(sessionId)) {
    return `session_id=${encodeURIComponent(sessionId)}`;
  }

  return "";
}

export function getSafeRedirectPath(value: unknown): string {
  if (typeof value !== "string") {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  let raw = value.trim();

  if (raw.length === 0 || raw.length > 512) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  try {
    raw = decodeURIComponent(raw);
  } catch {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  const { path, query } = splitPathAndQuery(raw);

  if (!path.startsWith("/")) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  if (path.startsWith("//") || path.includes("\\") || path.includes("://")) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  if (path.includes("\0") || path.includes("@")) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  if (!SAFE_INTERNAL_PATH.test(path)) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  if (
    path === LOGIN_PATH ||
    path.startsWith(`${LOGIN_PATH}/`) ||
    path === REGISTER_PATH ||
    path.startsWith(`${REGISTER_PATH}/`) ||
    path === FORGOT_PASSWORD_PATH ||
    path.startsWith(`${FORGOT_PASSWORD_PATH}/`)
  ) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  const allowedQuery = getAllowedRedirectQuery(path, query);
  return allowedQuery ? `${path}?${allowedQuery}` : path;
}

export function getCheckoutSuccessPath(sessionId?: string) {
  if (sessionId && SAFE_CHECKOUT_SESSION_ID.test(sessionId)) {
    return `${CHECKOUT_SUCCESS_PATH}?session_id=${encodeURIComponent(sessionId)}`;
  }

  return CHECKOUT_SUCCESS_PATH;
}

export function firstSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export function getLoginPath(redirectTo?: string) {
  if (!redirectTo) {
    return LOGIN_PATH;
  }

  const safe = getSafeRedirectPath(redirectTo);
  const params = new URLSearchParams({ redirectTo: safe });
  return `${LOGIN_PATH}?${params.toString()}`;
}

export function getRegisterPath(redirectTo?: string) {
  if (!redirectTo) {
    return REGISTER_PATH;
  }

  const safe = getSafeRedirectPath(redirectTo);
  const params = new URLSearchParams({ redirectTo: safe });
  return `${REGISTER_PATH}?${params.toString()}`;
}

export function getForgotPasswordPath() {
  return FORGOT_PASSWORD_PATH;
}

export function getResetPasswordPath() {
  return RESET_PASSWORD_PATH;
}

export function getPublicCatalogPath() {
  return PUBLIC_CATALOG_PATH;
}

export function getPublicProgramPath(slug: string) {
  return `${PUBLIC_CATALOG_PATH}/${slug}`;
}

export function isProtectedPath(pathname: string) {
  if (pathname === "/") {
    return true;
  }

  if (pathname === "/nastavitve" || pathname.startsWith("/nastavitve/")) {
    return true;
  }

  if (
    pathname === "/moji-programi" ||
    pathname.startsWith("/moji-programi/")
  ) {
    return true;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return true;
  }

  if (pathname === "/nakup/uspesno" || pathname.startsWith("/nakup/uspesno/")) {
    return true;
  }

  return false;
}

export {
  DEFAULT_AFTER_AUTH_PATH,
  FORGOT_PASSWORD_PATH,
  LOGIN_PATH,
  REGISTER_PATH,
  RESET_PASSWORD_PATH,
};
