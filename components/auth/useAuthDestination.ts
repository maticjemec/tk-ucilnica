"use client";

import { useRouter } from "next/navigation";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

/**
 * Complete client navigation after a server action has written auth cookies.
 *
 * replace() loads the destination as a new RSC request, so it sees the
 * session cookies from sign-in. Do not router.refresh() the login page:
 * that re-renders /prijava, which then 307s, and that competing navigation
 * is what left the client tree stuck after a successful action.
 */
export function useAuthDestination() {
  const router = useRouter();

  return function goToAuthDestination(path: string) {
    router.replace(getSafeRedirectPath(path));
  };
}
