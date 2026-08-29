import "server-only";

import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { PROGRAM_SLUG, USER_UUID } from "@/lib/billing/constants";
import { createAdminClient } from "@/lib/supabase/admin";

type PurchaseRow = {
  id: string;
  user_id: string;
  program_id: string;
  program_slug: string;
  amount_cents: number;
  currency: string;
  status: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function paymentIntentId(value: Stripe.Checkout.Session["payment_intent"]) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value === "object" && typeof value.id === "string") {
    return value.id;
  }

  return null;
}

function parsePurchase(value: unknown): PurchaseRow | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.user_id !== "string" ||
    typeof value.program_id !== "string" ||
    typeof value.program_slug !== "string" ||
    typeof value.amount_cents !== "number" ||
    typeof value.currency !== "string" ||
    typeof value.status !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    user_id: value.user_id,
    program_id: value.program_id,
    program_slug: value.program_slug,
    amount_cents: value.amount_cents,
    currency: value.currency,
    status: value.status,
  };
}

export async function recordStripeWebhookEvent(id: string, type: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("stripe_webhook_events").insert({
    id,
    type,
  });

  if (!error) {
    return { duplicate: false as const };
  }

  if (error.code === "23505") {
    return { duplicate: true as const };
  }

  console.error("[billing] Failed to record Stripe webhook event.");
  throw new Error("Failed to record webhook event.");
}

export async function forgetStripeWebhookEvent(id: string) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("stripe_webhook_events")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("[billing] Failed to release Stripe webhook event for retry.");
  }
}

async function loadPurchaseBySessionId(sessionId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("program_purchases")
    .select(
      "id, user_id, program_id, program_slug, amount_cents, currency, status",
    )
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("[billing] Failed to load purchase by session id.");
    return null;
  }

  return parsePurchase(data);
}

async function loadPurchaseById(id: string) {
  if (!USER_UUID.test(id)) {
    return null;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("program_purchases")
    .select(
      "id, user_id, program_id, program_slug, amount_cents, currency, status",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[billing] Failed to load purchase by id.");
    return null;
  }

  return parsePurchase(data);
}

async function programStillExists(programId: string, programSlug: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("programs")
    .select("id, slug")
    .eq("id", programId)
    .eq("slug", programSlug)
    .maybeSingle();

  return !error && isRecord(data) && typeof data.id === "string";
}

async function grantStripeEntitlement(userId: string, programSlug: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("user_programs").upsert(
    {
      user_id: userId,
      program_slug: programSlug,
      source: "stripe",
    },
    {
      onConflict: "user_id,program_slug",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    console.error("[billing] Failed to grant program entitlement.");
    throw new Error("Failed to grant entitlement.");
  }

  revalidatePath("/moji-programi");
  revalidatePath(`/moji-programi/${programSlug}`);
  revalidatePath(`/programi/${programSlug}`);
  revalidatePath("/");
  revalidatePath("/", "layout");
  revalidatePath("/nakup/uspesno");
}

function sessionMatchesPurchase(
  session: Stripe.Checkout.Session,
  purchase: PurchaseRow,
) {
  if (
    session.client_reference_id &&
    session.client_reference_id !== purchase.id
  ) {
    return false;
  }

  const metadata = session.metadata ?? {};

  if (metadata.purchase_id && metadata.purchase_id !== purchase.id) {
    return false;
  }

  if (metadata.user_id && metadata.user_id !== purchase.user_id) {
    return false;
  }

  if (
    metadata.program_slug &&
    metadata.program_slug !== purchase.program_slug
  ) {
    return false;
  }

  return true;
}

async function loadPurchaseForSession(session: Stripe.Checkout.Session) {
  const bySession = await loadPurchaseBySessionId(session.id);

  if (bySession) {
    return bySession;
  }

  if (!session.client_reference_id) {
    return null;
  }

  const purchase = await loadPurchaseById(session.client_reference_id);

  if (!purchase) {
    return null;
  }

  const admin = createAdminClient();
  await admin
    .from("program_purchases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", purchase.id)
    .is("stripe_checkout_session_id", null);

  return purchase;
}

export async function fulfillPaidCheckoutSession(
  session: Stripe.Checkout.Session,
) {
  if (session.payment_status !== "paid") {
    return;
  }

  const purchase = await loadPurchaseForSession(session);

  if (!purchase) {
    console.error("[billing] Paid Checkout Session has no purchase row.");
    return;
  }

  if (
    !USER_UUID.test(purchase.user_id) ||
    !PROGRAM_SLUG.test(purchase.program_slug) ||
    !sessionMatchesPurchase(session, purchase)
  ) {
    console.error("[billing] Checkout Session does not match purchase snapshot.");
    return;
  }

  if (
    session.amount_total !== purchase.amount_cents ||
    session.currency?.toLowerCase() !== purchase.currency.toLowerCase()
  ) {
    console.error("[billing] Checkout amount or currency mismatch.");
    return;
  }

  if (!(await programStillExists(purchase.program_id, purchase.program_slug))) {
    console.error("[billing] Purchase program no longer exists.");
    return;
  }

  const intentId = paymentIntentId(session.payment_intent);
  const admin = createAdminClient();

  if (purchase.status !== "paid") {
    const { error } = await admin
      .from("program_purchases")
      .update({
        status: "paid",
        stripe_payment_intent_id: intentId,
        paid_at: new Date().toISOString(),
      })
      .eq("id", purchase.id)
      .neq("status", "paid");

    if (error) {
      console.error("[billing] Failed to mark purchase paid.");
      throw new Error("Failed to mark purchase paid.");
    }
  }

  await grantStripeEntitlement(purchase.user_id, purchase.program_slug);
}

export async function markCheckoutSessionStatus(
  session: Stripe.Checkout.Session,
  status: "expired" | "failed",
) {
  const purchase = await loadPurchaseForSession(session);

  if (!purchase || purchase.status !== "pending") {
    return;
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("program_purchases")
    .update({ status })
    .eq("id", purchase.id)
    .eq("status", "pending");

  if (error) {
    console.error("[billing] Failed to update purchase status.");
    throw new Error("Failed to update purchase status.");
  }
}

export async function getPurchaseForAuthenticatedUser(
  sessionId: string,
  userId: string,
) {
  const purchase = await loadPurchaseBySessionId(sessionId);

  if (!purchase || purchase.user_id !== userId) {
    return null;
  }

  return purchase;
}
