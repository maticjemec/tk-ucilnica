import "server-only";

import { redirect } from "next/navigation";
import { getUserAccessContext, ownsProgram } from "@/lib/auth/access";
import { BILLING_ERRORS } from "@/lib/billing/errors";
import { getStripeClient } from "@/lib/billing/client";
import { PROGRAM_SLUG } from "@/lib/billing/constants";
import { getBillingRequestOrigin } from "@/lib/billing/origin";
import { getOwnedProgramOverviewPath } from "@/lib/owned-program/paths";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCurrency(value: string) {
  return value.trim().toLowerCase();
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

export async function startProgramCheckout(programSlug: string) {
  if (!PROGRAM_SLUG.test(programSlug)) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const access = await getUserAccessContext();

  if (access.status !== "authenticated") {
    return { error: BILLING_ERRORS.unauthenticated };
  }

  if (ownsProgram(access, programSlug)) {
    redirect(getOwnedProgramOverviewPath(programSlug));
  }

  const program = await loadPublishedProgram(programSlug);

  if (!program || program.priceCents <= 0) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const origin = await getBillingRequestOrigin();

  if (!origin) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const admin = createAdminClient();
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

  let session;

  try {
    session = await getStripeClient().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      client_reference_id: purchase.id,
      customer_email: access.user.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: program.currency,
            unit_amount: program.priceCents,
            product_data: {
              name: program.title,
            },
          },
        },
      ],
      metadata: {
        purchase_id: purchase.id,
        user_id: access.user.id,
        program_slug: program.slug,
      },
      success_url: `${origin}/nakup/uspesno?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/nakup/preklicano?slug=${encodeURIComponent(program.slug)}`,
    });
  } catch {
    console.error("[billing] Failed to create Stripe Checkout Session.");
    return { error: BILLING_ERRORS.startFailed };
  }

  if (!session.url || !session.id) {
    return { error: BILLING_ERRORS.startFailed };
  }

  const { error: updateError } = await admin
    .from("program_purchases")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", purchase.id)
    .eq("user_id", access.user.id);

  if (updateError) {
    console.error("[billing] Failed to store checkout session id.");
    return { error: BILLING_ERRORS.startFailed };
  }

  redirect(session.url);
}
