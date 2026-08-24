import "server-only";

import { headers } from "next/headers";

export async function isNextRouterPrefetch() {
  const headerStore = await headers();
  const value =
    headerStore.get("next-router-prefetch") ??
    headerStore.get("Next-Router-Prefetch");

  return value === "1";
}
