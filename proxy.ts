import { NextRequest, NextResponse } from "next/server";
import { getLoginPath, isProtectedPath } from "@/lib/auth/redirects";
import { updateSession } from "@/lib/supabase/proxy";

const LEGACY_MOCK_AUTH_COOKIE = "tk-ucilnica-mock-auth";

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

function expireLegacyMockAuthCookie(response: NextResponse) {
  response.cookies.set(LEGACY_MOCK_AUTH_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const proxiedRequest = new NextRequest(request, { headers: requestHeaders });
  const { response: supabaseResponse, isAuthenticated } =
    await updateSession(proxiedRequest);

  expireLegacyMockAuthCookie(supabaseResponse);

  if (isProtectedPath(pathname) && !isAuthenticated) {
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
