"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 2500;
const MAX_ATTEMPTS = 10;

/**
 * Re-reads the success page while Stripe webhook fulfillment may still
 * be in flight. Never grants entitlement — only refreshes server status.
 */
export function PurchaseAccessPoller() {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      router.refresh();

      if (attempts >= MAX_ATTEMPTS) {
        window.clearInterval(timer);
      }
    }, POLL_MS);

    return () => window.clearInterval(timer);
  }, [router]);

  return null;
}
