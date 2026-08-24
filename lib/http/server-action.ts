import "server-only";

import { headers } from "next/headers";

export async function isNextServerAction() {
  const headerStore = await headers();
  return headerStore.has("next-action");
}
