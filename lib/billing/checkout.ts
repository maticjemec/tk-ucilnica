import "server-only";

import type Stripe from "stripe";
import { getUserAccessContext } from "@/lib/auth/access";
import { getStripeClient } from "@/lib/billing/client";
import { PROGRAM_SLUG } from "@/lib/billing/constants";
import { BILLING_ERRORS } from "@/lib/billing/errors";
import { getBillingRequestOrigin } from "@/lib/billing/origin";
import { userOwnsProgram } from "@/lib/billing/ownership";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type AdminClient = ReturnType<typeof createAdminClient>;

type PendingPurchase = {
  id: string;
  stripe_checkout_session_id: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCurrency(value: string) {
  return value.trim().toLowerCase();
}

function parsePendingPurchase(value: unknown): PendingPurchase | null {
  if (!isRecord(value) || typeof value.id !== "string") {
    return null;
  }

  return {
    id: value.id,
    stripe_checkout_session_id:
      typeof value.stripe_checkout_session_id === "string"
        ? value.stripe_checkout_session_id
        : null,
  };
}

async function loadPublishedProgram(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("programs")
    .select("id, slug, title, price_cents, currency, is_published")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !isRecord(data)) {
    return null;
  }

  if (
    typeof data.id !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.title !== "string" ||
    typeof data.price_cents !== "number" ||
    !Number.isInteger(data.price_cents) ||
    data.price_cents < 1 ||
    typeof data.currency !== "string" ||
    data.is_published !== true
  ) {
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    priceCents: data.price_cents,
    currency: normalizeCurrency(data.currency),
  };
}

async function markPendingPurchase(
  admin: AdminClient,
  purchaseId: string,
  status: "failed" | "expired" | "canceled",
) {
  const { error } = await admin
    .from("program_purchases")
    .update({ status })
    .eq("id", purchaseId)
    .eq("status", "pending");

  if (error) {
    console.error("[billing] Failed to update pending purchase status.");
  }
}

async function loadPendingPurchases(
  admin: AdminClient,
  userId: string,
  programSlug: string,
) {
  const { data, error } = await admin
    .from("program_purchases")
    .select("id, stripe_checkout_session_id")
    .eq("user_id", userId)
    .eq("program_slug", programSlug)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[billing] Failed to load pending purchases.");
    return null;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(parsePendingPurchase)
    .filter((row): row is PendingPurchase => row !== null);
}

async function reuseOrInvalidatePendingCheckout(
  admin: AdminClient,
  userId: string,
  programSlug: string,
) {
  const pending = await loadPendingPurchases(admin, userId, programSlug);

  if (pending === null) {
    return { kind: "unavailable" as const };
  }

  const stripe = getStripeClient();
  let reusableUrl: string | null = null;
  let paidSessionId: string | null = null;

  for (const purchase of pending) {
    if (!purchase.stripe_checkout_session_id) {
      await markPendingPurchase(admin, purchase.id, "failed");
      continue;
    }

    let session: Stripe.Checkout.Session;

    try {
      session = await stripe.checkout.sessions.retrieve(
        purchase.stripe_checkout_session_id,
      );
    } catch {
      await markPendingPurchase(admin, purchase.id, "expired");
      continue;
    }

    if (session.status === "open" && session.url) {
      if (!reusableUrl) {
        reusableUrl = session.url;
      }
      continue;
    }

    if (session.status === "complete" && session.payment_status === "paid") {
      if (!paidSessionId) {
        paidSessionId = session.id;
      }
      continue;
    }

    if (session.status === "expired") {
      await markPendingPurchase(admin, purchase.id, "expired");
      continue;
    }

    await markPendingPurchase(admin, purchase.id, "canceled");
  }

  if (paidSessionId) {
    return { kind: "paid" as const, sessionId: paidSessionId };
  }

  if (reusableUrl) {
    return { kind: "reuse" as const, url: reusableUrl };
  }

  return { kind: "none" as const };
}

async function createStripeCheckoutSession(input: {
  purchaseId: string;
  userId: string;
  email: string;
  program: {
    slug: string;
    title: string;
    priceCents: number;
    currency: string;
  };
  origin: string;
}) {
  return getStripeClient().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    client_reference_id: input.purchaseId,
    customer_email: input.email || undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.program.currency,
          unit_amount: input.program.priceCents,
          product_data: {
            name: input.program.title,
          },
        },
      },
    ],
    metadata: {
      purchase_id: input.purchaseId,
      user_id: input.userId,
      program_slug: input.program.slug,
    },
    success_url: `${input.origin}/nakup/uspesno?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/nakup/preklicano?slug=${encodeURIComponent(input.program.slug)}`,
  });
}

export type CheckoutStartResult =
  | { error: string }
  | { checkoutUrl: string }
  | { redirectTo: string };

export async function startProgramCheckout(
  programSlug: string,
): Promise<CheckoutStartResult> {
  if (!PROGRAM_SLUG.test(programSlug)) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    return { error: BILLING_ERRORS.unauthenticated };
  }

  const program = await loadPublishedProgram(programSlug);

  if (!program) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const ownership = await userOwnsProgram(access.user.id, program.slug);

  if (!ownership.readable) {
    return { error: BILLING_ERRORS.startFailed };
  }

  if (ownership.owned) {
    return { redirectTo: getOwnedProgramOverviewPath(program.slug) };
  }

  const origin = await getBillingRequestOrigin();

  if (!origin) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const admin = createAdminClient();
  const existing = await reuseOrInvalidatePendingCheckout(
    admin,
    access.user.id,
    program.slug,
  );

  if (existing.kind === "unavailable") {
    return { error: BILLING_ERRORS.startFailed };
  }

  if (existing.kind === "paid") {
    return {
      redirectTo: `/nakup/uspesno?session_id=${encodeURIComponent(existing.sessionId)}`,
    };
  }

  if (existing.kind === "reuse") {
    return { checkoutUrl: existing.url };
  }

  const { data: purchase, error: insertError } = await admin
    .from("program_purchases")
    .insert({
      user_id: access.user.id,
      program_id: program.id,
      program_slug: program.slug,
      amount_cents: program.priceCents,
      currency: program.currency,
      status: "pending",
      source: "stripe",
    })
    .select("id")
    .maybeSingle();

  if (insertError || !purchase || typeof purchase.id !== "string") {
    console.error("[billing] Failed to create purchase snapshot.");
    return { error: BILLING_ERRORS.startFailed };
  }

  let session: Stripe.Checkout.Session;

  try {
    session = await createStripeCheckoutSession({
      purchaseId: purchase.id,
      userId: access.user.id,
      email: access.user.email,
      program,
      origin,
    });
  } catch {
    console.error("[billing] Failed to create Stripe Checkout Session.");
    await markPendingPurchase(admin, purchase.id, "failed");
    return { error: BILLING_ERRORS.startFailed };
  }

  if (!session.url || !session.id) {
    await markPendingPurchase(admin, purchase.id, "failed");
    return { error: BILLING_ERRORS.startFailed };
  }

  const { error: updateError } = await admin
    .from("program_purchases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", purchase.id)
    .eq("user_id", access.user.id);

  if (updateError) {
    console.error("[billing] Failed to store checkout session id.");

    try {
      await getStripeClient().checkout.sessions.expire(session.id);
    } catch {
      console.error("[billing] Failed to expire unused Checkout Session.");
    }

    await markPendingPurchase(admin, purchase.id, "failed");
    return { error: BILLING_ERRORS.startFailed };
  }

  return { checkoutUrl: session.url };
}
