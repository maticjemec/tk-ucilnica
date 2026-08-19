import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  MOCK_AUTH_COOKIE,
  resolveMockAuthStatus,
} from "@/lib/auth/mock-session";
import { getLoginPath, isProtectedPath } from "@/lib/auth/redirects";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const status = resolveMockAuthStatus(
    request.cookies.get(MOCK_AUTH_COOKIE)?.value,
  );

  if (isProtectedPath(pathname) && status === "guest") {
    return NextResponse.redirect(new URL(getLoginPath(pathname), request.url));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
