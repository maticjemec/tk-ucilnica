import "server-only";

import { headers } from "next/headers";

const ORIGIN = /^https?:\/\/[a-z0-9.-]+(?::\d+)?$/i;

export async function getBillingRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin")?.trim();

  if (origin && ORIGIN.test(origin)) {
    return origin;
  }

  const host = (
    headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? ""
  ).trim();
  const proto = (headerStore.get("x-forwarded-proto") ?? "http").trim();

  if (!host || host.includes("/") || host.includes("\\")) {
    return null;
  }

  const assembled = `${proto}://${host}`;
  return ORIGIN.test(assembled) ? assembled : null;
}
