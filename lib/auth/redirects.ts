const LOGIN_PATH = "/prijava";
const REGISTER_PATH = "/registracija";
const DEFAULT_AFTER_AUTH_PATH = "/";
const PUBLIC_CATALOG_PATH = "/programi";

const SAFE_INTERNAL_PATH = /^\/(?:[a-zA-Z0-9._~-]+\/?)*$/;

export function getSafeRedirectPath(value: unknown): string {
  if (typeof value !== "string") {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  let path = value.trim();

  if (path.length === 0 || path.length > 512) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  try {
    path = decodeURIComponent(path);
  } catch {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  path = path.split("?")[0]?.split("#")[0] ?? path;

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
    path.startsWith(`${REGISTER_PATH}/`)
  ) {
    return DEFAULT_AFTER_AUTH_PATH;
  }

  return path;
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

  return false;
}

export { DEFAULT_AFTER_AUTH_PATH, LOGIN_PATH, REGISTER_PATH };
