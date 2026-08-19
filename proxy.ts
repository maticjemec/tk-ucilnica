import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_AUTH_COOKIE,
  resolveMockAuthStatus,
} from "@/lib/auth/mock-session";
import { getLoginPath, isProtectedPath } from "@/lib/auth/redirects";
import { updateSession } from "@/lib/supabase/proxy";

function copySupabaseCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });

  for (const header of ["cache-control", "expires", "pragma"] as const) {
    const value = from.headers.get(header);
    if (value) {
      to.headers.set(header, value);
    }
  }

  return to;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const proxiedRequest = new NextRequest(request, { headers: requestHeaders });
  const supabaseResponse = await updateSession(proxiedRequest);

  const status = resolveMockAuthStatus(
    proxiedRequest.cookies.get(MOCK_AUTH_COOKIE)?.value,
  );

  if (isProtectedPath(pathname) && status === "guest") {
    const redirectResponse = NextResponse.redirect(
      new URL(getLoginPath(pathname), request.url),
    );

    return copySupabaseCookies(supabaseResponse, redirectResponse);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
